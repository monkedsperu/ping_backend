import { Inject, Injectable, NotFoundException } from '@nestjs/common';
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

export interface AdminThreadView {
  responderId: string;
  responderName: string;
  responderEmail: string;
  messageCount: number;
  lastMessage?: string;
  lastMessageAt?: Date;
}

/** Detalle de un ping para el panel de admin: el mensaje + todas sus
 * conversaciones (quién respondió y un resumen de cada una) — sin la
 * restricción de "solo el autor puede verlo" que sí aplica en la app. */
@Injectable()
export class AdminGetPingThreadsUseCase {
  constructor(
    @Inject(PING_REPOSITORY) private readonly pingRepository: PingRepositoryPort,
    @Inject(PING_THREAD_REPOSITORY)
    private readonly threadRepository: PingThreadRepositoryPort,
    @Inject(THREAD_MESSAGE_REPOSITORY)
    private readonly messageRepository: ThreadMessageRepositoryPort,
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepositoryPort,
  ) {}

  async execute(pingId: string): Promise<AdminThreadView[]> {
    const ping = await this.pingRepository.findById(pingId);
    if (!ping) {
      throw new NotFoundException('El ping no existe.');
    }

    const threads = await this.threadRepository.findByPingId(pingId);

    return Promise.all(
      threads.map(async (thread) => {
        const [responder, messages] = await Promise.all([
          this.userRepository.findById(thread.responderId),
          this.messageRepository.findByThreadId(thread.id),
        ]);
        const last = messages[messages.length - 1]?.toProps();
        return {
          responderId: thread.responderId,
          responderName: responder?.displayName ?? 'Usuario',
          responderEmail: responder?.email ?? '—',
          messageCount: messages.length,
          lastMessage: last?.message,
          lastMessageAt: last?.createdAt,
        };
      }),
    );
  }
}
