import { Inject, Injectable } from '@nestjs/common';
import { GeoPoint } from '../../domain/value-objects/geo-point.vo';
import {
  PING_REPOSITORY,
  PingRepositoryPort,
} from '../../domain/ports/ping-repository.port';
import {
  PING_THREAD_REPOSITORY,
  PingThreadRepositoryPort,
} from '../../domain/ports/ping-thread-repository.port';
import { USER_REPOSITORY, UserRepositoryPort } from '../../domain/ports/user-repository.port';
import {
  SETTINGS_REPOSITORY,
  SettingsRepositoryPort,
} from '../../domain/ports/settings-repository.port';
import {
  USER_BLOCK_REPOSITORY,
  UserBlockRepositoryPort,
} from '../../domain/ports/user-block-repository.port';
import { GetNearbyPingsDto } from '../dto/get-nearby-pings.dto';

export interface NearbyPingView {
  id: string;
  message: string;
  imageUrl?: string;
  color?: string;
  categoryKey: string;
  authorName: string;
  authorRole: string;
  latitude: number;
  longitude: number;
  radiusMeters: number;
  distanceMeters: number;
  createdAt: Date;
  expiresAt: Date;
  isOwnPing: boolean;
  threadCount: number;
}

const BASE_MAX_LISTENING_RADIUS = 2000;

/**
 * viewerId es opcional (navegación sin cuenta). Solo cuando hay viewer
 * identificado calculamos isOwnPing/threadCount, filtramos por
 * bloqueos, y aplicamos su preferencia de categorías — alguien sin
 * cuenta ve todo, sin filtrar (no tiene preferencia que aplicar).
 */
@Injectable()
export class GetNearbyPingsUseCase {
  constructor(
    @Inject(PING_REPOSITORY) private readonly pingRepository: PingRepositoryPort,
    @Inject(PING_THREAD_REPOSITORY)
    private readonly threadRepository: PingThreadRepositoryPort,
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepositoryPort,
    @Inject(SETTINGS_REPOSITORY) private readonly settingsRepository: SettingsRepositoryPort,
    @Inject(USER_BLOCK_REPOSITORY)
    private readonly userBlockRepository: UserBlockRepositoryPort,
  ) {}

  async execute(dto: GetNearbyPingsDto, viewerId: string | null): Promise<NearbyPingView[]> {
    const center = GeoPoint.create(dto.latitude, dto.longitude);

    const viewer = viewerId ? await this.userRepository.findById(viewerId) : null;
    const role = viewer?.role ?? 'user';
    const limits = await this.settingsRepository.getRoleLimits(role);
    const maxAllowed = Math.max(...limits.allowedListeningRadii, BASE_MAX_LISTENING_RADIUS);
    const listeningRadiusMeters = Math.min(dto.listeningRadiusMeters, maxAllowed);

    const [pings, blockedIds] = await Promise.all([
      this.pingRepository.findCollidingWithListeningArea(center, listeningRadiusMeters),
      viewerId ? this.userBlockRepository.findBlockedIdsByUser(viewerId) : Promise.resolve([]),
    ]);
    const blockedSet = new Set(blockedIds);

    // Vacío = "quiero ver todas" — no filtramos nada en ese caso.
    const categoryFilter = viewer && viewer.visibleCategories.length > 0
      ? new Set(viewer.visibleCategories)
      : null;

    const filteredPings = pings.filter((ping) => {
      if (categoryFilter && !categoryFilter.has(ping.categoryKey)) return false;
      return true;
    });

    const views = await Promise.all(
      filteredPings.map(async (ping) => {
        const isOwnPing = viewerId !== null && ping.authorId === viewerId;
        const [threadCount, author, blockedTheOtherWay] = await Promise.all([
          isOwnPing
            ? this.threadRepository.findByPingId(ping.id).then((t) => t.length)
            : Promise.resolve(0),
          this.userRepository.findById(ping.authorId),
          // Bloqueo es mutuo en sus efectos: si el AUTOR bloqueó al
          // viewer (no al revés, ya cubierto por blockedSet), tampoco
          // debe verlo — se resuelve por-ping porque cada ping tiene un
          // autor distinto.
          viewerId && !isOwnPing
            ? this.userBlockRepository.isBlockedEitherWay(ping.authorId, viewerId)
            : Promise.resolve(false),
        ]);

        if (blockedSet.has(ping.authorId) || blockedTheOtherWay) {
          return null;
        }

        return {
          id: ping.id,
          message: ping.message,
          imageUrl: ping.imageUrl,
          color: ping.color,
          categoryKey: ping.categoryKey,
          authorName: author?.displayName ?? 'Usuario',
          authorRole: author?.role ?? 'user',
          latitude: ping.location.latitude,
          longitude: ping.location.longitude,
          radiusMeters: ping.radiusMeters,
          distanceMeters: Math.round(center.distanceInMetersTo(ping.location)),
          createdAt: ping.createdAt,
          expiresAt: ping.expiresAt,
          isOwnPing,
          threadCount,
        };
      }),
    );

    return views
      .filter((v): v is NonNullable<typeof v> => v !== null)
      .sort((a, b) => a.distanceMeters - b.distanceMeters);
  }
}
