import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { USER_REPOSITORY, UserRepositoryPort } from '../../domain/ports/user-repository.port';
import { PING_REPOSITORY, PingRepositoryPort } from '../../domain/ports/ping-repository.port';
import {
  PING_THREAD_REPOSITORY,
  PingThreadRepositoryPort,
} from '../../domain/ports/ping-thread-repository.port';

export interface AdminUserDetail {
  id: string;
  email: string;
  displayName: string;
  role: string;
  isDisabled: boolean;
  hasGoogle: boolean;
  createdAt: Date;
  createdPings: {
    id: string;
    message: string;
    createdAt: Date;
    isActive: boolean;
    threadCount: number;
  }[];
  respondedTo: {
    pingId: string;
    pingMessage: string;
    pingAuthorId: string;
    respondedAt: Date;
  }[];
}

/** "Actividad de un usuario": qué anuncios ha creado y en cuáles ha
 * respondido — lo mínimo útil para entender el comportamiento de una
 * cuenta sin tener que cruzar tablas a mano. */
@Injectable()
export class AdminGetUserDetailUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepositoryPort,
    @Inject(PING_REPOSITORY) private readonly pingRepository: PingRepositoryPort,
    @Inject(PING_THREAD_REPOSITORY)
    private readonly threadRepository: PingThreadRepositoryPort,
  ) {}

  async execute(userId: string): Promise<AdminUserDetail> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado.');
    }

    const now = new Date();
    const [ownPings, respondedThreads] = await Promise.all([
      this.pingRepository.findByAuthorId(userId),
      this.threadRepository.findByResponderId(userId),
    ]);

    const createdPings = await Promise.all(
      ownPings.map(async (ping) => {
        const threads = await this.threadRepository.findByPingId(ping.id);
        const p = ping.toProps();
        return {
          id: p.id,
          message: p.message,
          createdAt: p.createdAt,
          isActive: ping.isActive(now),
          threadCount: threads.length,
        };
      }),
    );

    const respondedTo = await Promise.all(
      respondedThreads.map(async (thread) => {
        const ping = await this.pingRepository.findById(thread.pingId);
        const p = ping?.toProps();
        return {
          pingId: thread.pingId,
          pingMessage: p?.message ?? '(anuncio eliminado)',
          pingAuthorId: p?.authorId ?? '',
          respondedAt: thread.createdAt,
        };
      }),
    );

    return {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      role: user.role,
      isDisabled: user.isDisabled,
      hasGoogle: Boolean(user.googleId),
      createdAt: user.createdAt,
      createdPings,
      respondedTo,
    };
  }
}
