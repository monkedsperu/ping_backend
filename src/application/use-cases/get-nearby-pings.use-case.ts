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
import { GetNearbyPingsDto } from '../dto/get-nearby-pings.dto';

export interface NearbyPingView {
  id: string;
  message: string;
  imageUrl?: string;
  color?: string;
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
 * identificado calculamos isOwnPing/threadCount, y solo para SUS PROPIOS
 * pings — no tiene sentido consultar hilos de pings ajenos solo para
 * mostrar la lista. authorName sí se resuelve siempre, para todos.
 */
@Injectable()
export class GetNearbyPingsUseCase {
  constructor(
    @Inject(PING_REPOSITORY) private readonly pingRepository: PingRepositoryPort,
    @Inject(PING_THREAD_REPOSITORY)
    private readonly threadRepository: PingThreadRepositoryPort,
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepositoryPort,
    @Inject(SETTINGS_REPOSITORY) private readonly settingsRepository: SettingsRepositoryPort,
  ) {}

  async execute(dto: GetNearbyPingsDto, viewerId: string | null): Promise<NearbyPingView[]> {
    const center = GeoPoint.create(dto.latitude, dto.longitude);

    const viewer = viewerId ? await this.userRepository.findById(viewerId) : null;
    const role = viewer?.role ?? 'user';
    const limits = await this.settingsRepository.getRoleLimits(role);
    const maxAllowed = Math.max(...limits.allowedListeningRadii, BASE_MAX_LISTENING_RADIUS);
    const listeningRadiusMeters = Math.min(dto.listeningRadiusMeters, maxAllowed);

    const pings = await this.pingRepository.findCollidingWithListeningArea(
      center,
      listeningRadiusMeters,
    );

    const views = await Promise.all(
      pings.map(async (ping) => {
        const isOwnPing = viewerId !== null && ping.authorId === viewerId;
        const [threadCount, author] = await Promise.all([
          isOwnPing
            ? this.threadRepository.findByPingId(ping.id).then((t) => t.length)
            : Promise.resolve(0),
          this.userRepository.findById(ping.authorId),
        ]);

        return {
          id: ping.id,
          message: ping.message,
          imageUrl: ping.imageUrl,
          color: ping.color,
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

    return views.sort((a, b) => a.distanceMeters - b.distanceMeters);
  }
}
