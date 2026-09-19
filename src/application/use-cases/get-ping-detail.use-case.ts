import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  PING_REPOSITORY,
  PingRepositoryPort,
} from '../../domain/ports/ping-repository.port';
import {
  PING_VIEW_REPOSITORY,
  PingViewRepositoryPort,
} from '../../domain/ports/ping-view-repository.port';
import { USER_REPOSITORY, UserRepositoryPort } from '../../domain/ports/user-repository.port';

export interface PingDetailView {
  id: string;
  message: string;
  imageUrl?: string;
  color?: string;
  authorId: string;
  authorName: string;
  latitude: number;
  longitude: number;
  radiusMeters: number;
  createdAt: Date;
  expiresAt: Date;
  status: string;
  isOwnPing: boolean;
  viewCount: number;
}

@Injectable()
export class GetPingDetailUseCase {
  constructor(
    @Inject(PING_REPOSITORY) private readonly pingRepository: PingRepositoryPort,
    @Inject(PING_VIEW_REPOSITORY) private readonly pingViewRepository: PingViewRepositoryPort,
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepositoryPort,
  ) {}

  async execute(pingId: string, viewerId: string | null): Promise<PingDetailView> {
    const ping = await this.pingRepository.findById(pingId);
    if (!ping) {
      throw new NotFoundException('El ping no existe.');
    }

    const p = ping.toProps();
    const isOwnPing = viewerId !== null && p.authorId === viewerId;

    if (viewerId !== null && !isOwnPing) {
      await this.pingViewRepository.recordView(pingId, viewerId);
    }
    const [viewCount, author] = await Promise.all([
      this.pingViewRepository.countViews(pingId),
      this.userRepository.findById(p.authorId),
    ]);

    return {
      id: p.id,
      message: p.message,
      imageUrl: p.imageUrl,
      color: p.color,
      authorId: p.authorId,
      authorName: author?.displayName ?? 'Usuario',
      latitude: p.location.latitude,
      longitude: p.location.longitude,
      radiusMeters: p.radiusMeters,
      createdAt: p.createdAt,
      expiresAt: p.expiresAt,
      status: p.status,
      isOwnPing,
      viewCount,
    };
  }
}
