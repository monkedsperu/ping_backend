import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PING_REPOSITORY, PingRepositoryPort } from '../../domain/ports/ping-repository.port';
import { USER_REPOSITORY, UserRepositoryPort } from '../../domain/ports/user-repository.port';
import {
  PING_VIEW_REPOSITORY,
  PingViewRepositoryPort,
} from '../../domain/ports/ping-view-repository.port';
import {
  PING_THREAD_REPOSITORY,
  PingThreadRepositoryPort,
} from '../../domain/ports/ping-thread-repository.port';

export interface AdminPingDetail {
  id: string;
  message: string;
  imageUrl?: string;
  authorId: string;
  authorName: string;
  authorEmail: string;
  latitude: number;
  longitude: number;
  radiusMeters: number;
  isSocial: boolean;
  categoryKey: string;
  status: string;
  isActive: boolean;
  durationMinutes: number;
  viewCount: number;
  threadCount: number;
  createdAt: Date;
  expiresAt: Date;
}

/** A diferencia de GetPingDetailUseCase (el que usa la app), este NO
 * registra una vista — el admin navegando no debe inflar el contador. */
@Injectable()
export class AdminGetPingUseCase {
  constructor(
    @Inject(PING_REPOSITORY) private readonly pingRepository: PingRepositoryPort,
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepositoryPort,
    @Inject(PING_VIEW_REPOSITORY) private readonly pingViewRepository: PingViewRepositoryPort,
    @Inject(PING_THREAD_REPOSITORY)
    private readonly threadRepository: PingThreadRepositoryPort,
  ) {}

  async execute(pingId: string): Promise<AdminPingDetail> {
    const ping = await this.pingRepository.findById(pingId);
    if (!ping) {
      throw new NotFoundException('El ping no existe.');
    }
    const p = ping.toProps();
    const [author, viewCount, threads] = await Promise.all([
      this.userRepository.findById(p.authorId),
      this.pingViewRepository.countViews(pingId),
      this.threadRepository.findByPingId(pingId),
    ]);

    const durationMinutes = Math.round(
      (p.expiresAt.getTime() - p.createdAt.getTime()) / 60_000,
    );

    return {
      id: p.id,
      message: p.message,
      imageUrl: p.imageUrl,
      authorId: p.authorId,
      authorName: author?.displayName ?? 'Usuario',
      authorEmail: author?.email ?? '—',
      latitude: p.location.latitude,
      longitude: p.location.longitude,
      radiusMeters: p.radiusMeters,
      isSocial: p.isSocial,
      categoryKey: p.categoryKey,
      status: p.status,
      isActive: ping.isActive(new Date()),
      durationMinutes,
      viewCount,
      threadCount: threads.length,
      createdAt: p.createdAt,
      expiresAt: p.expiresAt,
    };
  }
}
