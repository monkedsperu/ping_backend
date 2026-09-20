import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  PING_THREAD_REPOSITORY,
  PingThreadRepositoryPort,
} from '../../domain/ports/ping-thread-repository.port';
import {
  THREAD_MESSAGE_REPOSITORY,
  ThreadMessageRepositoryPort,
} from '../../domain/ports/thread-message-repository.port';
import { PING_REPOSITORY, PingRepositoryPort } from '../../domain/ports/ping-repository.port';
import { USER_REPOSITORY, UserRepositoryPort } from '../../domain/ports/user-repository.port';

export interface AdminMessageView {
  id: string;
  senderId: string;
  senderName: string;
  message: string;
  imageUrl?: string;
  createdAt: Date;
}

/** El historial completo de una conversación puntual — para auditoría.
 * Sí, se guarda cada mensaje con su remitente y fecha, para siempre
 * (mientras el ping/thread no se borre de la base). */
@Injectable()
export class AdminGetConversationUseCase {
  constructor(
    @Inject(PING_THREAD_REPOSITORY)
    private readonly threadRepository: PingThreadRepositoryPort,
    @Inject(THREAD_MESSAGE_REPOSITORY)
    private readonly messageRepository: ThreadMessageRepositoryPort,
    @Inject(PING_REPOSITORY) private readonly pingRepository: PingRepositoryPort,
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepositoryPort,
  ) {}

  async execute(pingId: string, responderId: string): Promise<AdminMessageView[]> {
    const thread = await this.threadRepository.findByPingAndResponder(pingId, responderId);
    if (!thread) {
      throw new NotFoundException('Esa conversación no existe.');
    }

    const ping = await this.pingRepository.findById(pingId);
    // Un hilo solo tiene 2 participantes posibles: el autor del ping y
    // quien respondió — resolvemos ambos nombres una sola vez.
    const [author, responder] = await Promise.all([
      ping ? this.userRepository.findById(ping.toProps().authorId) : null,
      this.userRepository.findById(responderId),
    ]);
    const nameById = new Map<string, string>();
    if (author) nameById.set(author.id, author.displayName);
    if (responder) nameById.set(responder.id, responder.displayName);

    const messages = await this.messageRepository.findByThreadId(thread.id);
    return messages.map((m) => {
      const p = m.toProps();
      return { ...p, senderName: nameById.get(p.senderId) ?? 'Usuario' };
    });
  }
}
