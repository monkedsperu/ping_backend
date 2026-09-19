import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PING_REPOSITORY, PingRepositoryPort } from '../../domain/ports/ping-repository.port';
import {
  PING_THREAD_REPOSITORY,
  PingThreadRepositoryPort,
} from '../../domain/ports/ping-thread-repository.port';
import {
  THREAD_MESSAGE_REPOSITORY,
  ThreadMessageRepositoryPort,
} from '../../domain/ports/thread-message-repository.port';
import { USER_REPOSITORY, UserRepositoryPort } from '../../domain/ports/user-repository.port';

export interface ThreadSummaryView {
  responderId: string;
  responderName: string;
  lastMessage: string;
  lastMessageAt: Date;
}

@Injectable()
export class GetPingThreadsUseCase {
  constructor(
    @Inject(PING_REPOSITORY) private readonly pingRepository: PingRepositoryPort,
    @Inject(PING_THREAD_REPOSITORY)
    private readonly threadRepository: PingThreadRepositoryPort,
    @Inject(THREAD_MESSAGE_REPOSITORY)
    private readonly messageRepository: ThreadMessageRepositoryPort,
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepositoryPort,
  ) {}

  async execute(pingId: string, viewerId: string): Promise<ThreadSummaryView[]> {
    const ping = await this.pingRepository.findById(pingId);
    if (!ping) {
      throw new NotFoundException('El ping no existe.');
    }
    if (ping.authorId !== viewerId) {
      throw new ForbiddenException('Solo el autor del ping puede ver esta lista.');
    }

    const threads = await this.threadRepository.findByPingId(pingId);

    const summaries = await Promise.all(
      threads.map(async (thread) => {
        const [lastMessage, responder] = await Promise.all([
          this.messageRepository.findLastByThreadId(thread.id),
          this.userRepository.findById(thread.responderId),
        ]);
        return {
          responderId: thread.responderId,
          responderName: responder?.displayName ?? 'Usuario',
          lastMessage: lastMessage?.toProps().message ?? '',
          lastMessageAt: lastMessage?.toProps().createdAt ?? thread.createdAt,
        };
      }),
    );

    return summaries.sort((a, b) => b.lastMessageAt.getTime() - a.lastMessageAt.getTime());
  }
}
