import { Inject, Injectable } from '@nestjs/common';
import { PING_REPOSITORY, PingRepositoryPort } from '../../domain/ports/ping-repository.port';
import {
  PING_THREAD_REPOSITORY,
  PingThreadRepositoryPort,
} from '../../domain/ports/ping-thread-repository.port';
import { USER_REPOSITORY, UserRepositoryPort } from '../../domain/ports/user-repository.port';

export interface AdminPingView {
  id: string;
  message: string;
  authorId: string;
  authorName: string;
  authorEmail: string;
  latitude: number;
  longitude: number;
  radiusMeters: number;
  status: string;
  isActive: boolean;
  threadCount: number;
  createdAt: Date;
  expiresAt: Date;
}

@Injectable()
export class AdminListPingsUseCase {
  constructor(
    @Inject(PING_REPOSITORY) private readonly pingRepository: PingRepositoryPort,
    @Inject(PING_THREAD_REPOSITORY)
    private readonly threadRepository: PingThreadRepositoryPort,
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepositoryPort,
  ) {}

  async execute(): Promise<AdminPingView[]> {
    const pings = await this.pingRepository.findAll();
    const now = new Date();

    return Promise.all(
      pings.map(async (ping) => {
        const p = ping.toProps();
        const [threads, author] = await Promise.all([
          this.threadRepository.findByPingId(ping.id),
          this.userRepository.findById(p.authorId),
        ]);
        return {
          id: p.id,
          message: p.message,
          authorId: p.authorId,
          authorName: author?.displayName ?? 'Usuario',
          authorEmail: author?.email ?? '—',
          latitude: p.location.latitude,
          longitude: p.location.longitude,
          radiusMeters: p.radiusMeters,
          status: p.status,
          isActive: ping.isActive(now),
          threadCount: threads.length,
          createdAt: p.createdAt,
          expiresAt: p.expiresAt,
        };
      }),
    );
  }
}
