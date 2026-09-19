import { Inject, Injectable } from '@nestjs/common';
import {
  PING_REPOSITORY,
  PingRepositoryPort,
} from '../../domain/ports/ping-repository.port';
import {
  PING_THREAD_REPOSITORY,
  PingThreadRepositoryPort,
} from '../../domain/ports/ping-thread-repository.port';
import {
  PING_VIEW_REPOSITORY,
  PingViewRepositoryPort,
} from '../../domain/ports/ping-view-repository.port';

export interface MyPingView {
  id: string;
  message: string;
  imageUrl?: string;
  color?: string;
  radiusMeters: number;
  createdAt: Date;
  expiresAt: Date;
  status: string;
  isActive: boolean;
  threadCount: number;
  viewCount: number;
}

/**
 * "Mis pings": tus conversaciones no deberían desaparecer solo porque tu
 * círculo de escucha ya no cubre un ping que pusiste en otro lado del
 * mapa. Esta lista es independiente de esa ubicación/radio actual.
 */
@Injectable()
export class GetMyPingsUseCase {
  constructor(
    @Inject(PING_REPOSITORY) private readonly pingRepository: PingRepositoryPort,
    @Inject(PING_THREAD_REPOSITORY)
    private readonly threadRepository: PingThreadRepositoryPort,
    @Inject(PING_VIEW_REPOSITORY)
    private readonly pingViewRepository: PingViewRepositoryPort,
  ) {}

  async execute(authorId: string): Promise<MyPingView[]> {
    const pings = await this.pingRepository.findByAuthorId(authorId);
    const now = new Date();

    return Promise.all(
      pings.map(async (ping) => {
        const [threads, viewCount] = await Promise.all([
          this.threadRepository.findByPingId(ping.id),
          this.pingViewRepository.countViews(ping.id),
        ]);
        const p = ping.toProps();
        return {
          id: p.id,
          message: p.message,
          imageUrl: p.imageUrl,
          color: p.color,
          radiusMeters: p.radiusMeters,
          createdAt: p.createdAt,
          expiresAt: p.expiresAt,
          status: p.status,
          isActive: ping.isActive(now),
          threadCount: threads.length,
          viewCount,
        };
      }),
    );
  }
}
