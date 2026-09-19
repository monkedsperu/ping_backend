import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { ThreadMessage } from '../../domain/entities/thread-message.entity';
import { PING_REPOSITORY, PingRepositoryPort } from '../../domain/ports/ping-repository.port';
import {
  PING_THREAD_REPOSITORY,
  PingThreadRepositoryPort,
} from '../../domain/ports/ping-thread-repository.port';
import {
  THREAD_MESSAGE_REPOSITORY,
  ThreadMessageRepositoryPort,
} from '../../domain/ports/thread-message-repository.port';
import { SendThreadMessageDto } from '../dto/thread-message.dto';

/**
 * Un hilo tiene exactamente dos participantes posibles: el autor del ping
 * y el respondiente original. Cualquier otra persona que intente escribir
 * ahí (incluso otro usuario autenticado válido) debe ser rechazada — esto
 * es lo que mantiene cada conversación privada entre esos dos.
 */
@Injectable()
export class SendThreadMessageUseCase {
  constructor(
    @Inject(PING_REPOSITORY) private readonly pingRepository: PingRepositoryPort,
    @Inject(PING_THREAD_REPOSITORY)
    private readonly threadRepository: PingThreadRepositoryPort,
    @Inject(THREAD_MESSAGE_REPOSITORY)
    private readonly messageRepository: ThreadMessageRepositoryPort,
  ) {}

  async execute(
    pingId: string,
    responderIdInThread: string,
    dto: SendThreadMessageDto,
    senderId: string,
  ): Promise<ThreadMessage> {
    const ping = await this.pingRepository.findById(pingId);
    if (!ping) {
      throw new NotFoundException('El ping no existe.');
    }
    if (!ping.isActive(new Date())) {
      throw new ForbiddenException('Este ping ya expiró; la conversación quedó congelada.');
    }

    const thread = await this.threadRepository.findByPingAndResponder(
      pingId,
      responderIdInThread,
    );
    if (!thread) {
      throw new NotFoundException('Esta conversación no existe todavía.');
    }

    const isParticipant = senderId === ping.authorId || senderId === responderIdInThread;
    if (!isParticipant) {
      throw new ForbiddenException('No formas parte de esta conversación.');
    }

    const message = ThreadMessage.create({
      id: randomUUID(),
      threadId: thread.id,
      senderId,
      message: dto.message,
      imageUrl: dto.imageUrl,
      now: new Date(),
    });

    await this.messageRepository.save(message);
    return message;
  }
}
