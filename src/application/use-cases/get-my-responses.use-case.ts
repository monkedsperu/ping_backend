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
  THREAD_MESSAGE_REPOSITORY,
  ThreadMessageRepositoryPort,
} from '../../domain/ports/thread-message-repository.port';
import { USER_REPOSITORY, UserRepositoryPort } from '../../domain/ports/user-repository.port';

export interface MyResponseView {
  pingId: string;
  responderId: string; // vos mismo — se manda igual para que el cliente arme la ruta del hilo sin adivinar
  pingMessage: string;
  authorName: string;
  color?: string;
  lastMessage: string;
  lastMessageAt: Date;
  isPingActive: boolean;
  pingExpiresAt: Date;
}

/**
 * "Mis respuestas": una conversación que ya empezaste no debería
 * desaparecer solo porque tu radio de escucha ya no cubre ese ping —
 * esta lista es tu forma de encontrarla de nuevo, hasta que expire.
 */
@Injectable()
export class GetMyResponsesUseCase {
  constructor(
    @Inject(PING_REPOSITORY) private readonly pingRepository: PingRepositoryPort,
    @Inject(PING_THREAD_REPOSITORY)
    private readonly threadRepository: PingThreadRepositoryPort,
    @Inject(THREAD_MESSAGE_REPOSITORY)
    private readonly messageRepository: ThreadMessageRepositoryPort,
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepositoryPort,
  ) {}

  async execute(responderId: string): Promise<MyResponseView[]> {
    const threads = await this.threadRepository.findByResponderId(responderId);
    const now = new Date();

    const views = await Promise.all(
      threads.map(async (thread) => {
        const ping = await this.pingRepository.findById(thread.pingId);
        if (!ping) return null; // defensivo: no debería pasar, pero no tronamos la lista entera por uno

        const [lastMessage, author] = await Promise.all([
          this.messageRepository.findLastByThreadId(thread.id),
          this.userRepository.findById(ping.authorId),
        ]);

        const p = ping.toProps();
        const view: MyResponseView = {
          pingId: p.id,
          responderId,
          pingMessage: p.message,
          authorName: author?.displayName ?? 'Usuario',
          color: p.color,
          lastMessage: lastMessage?.toProps().message ?? '',
          lastMessageAt: lastMessage?.toProps().createdAt ?? thread.createdAt,
          isPingActive: ping.isActive(now),
          pingExpiresAt: p.expiresAt,
        };
        return view;
      }),
    );

    return views
      .filter((v): v is MyResponseView => v !== null)
      .sort((a, b) => b.lastMessageAt.getTime() - a.lastMessageAt.getTime());
  }
}
