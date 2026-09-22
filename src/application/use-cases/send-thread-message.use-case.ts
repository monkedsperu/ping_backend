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
import {
  USER_BLOCK_REPOSITORY,
  UserBlockRepositoryPort,
} from '../../domain/ports/user-block-repository.port';
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
    @Inject(USER_BLOCK_REPOSITORY)
    private readonly userBlockRepository: UserBlockRepositoryPort,
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

    // El bloqueo aplica aunque la conversación ya existiera de antes —
    // si cualquiera de los dos bloqueó al otro DESPUÉS de empezar a
    // hablar, dejan de poder seguir escribiéndose.
    const otherParticipantId = senderId === ping.authorId ? responderIdInThread : ping.authorId;
    const blocked = await this.userBlockRepository.isBlockedEitherWay(senderId, otherParticipantId);
    if (blocked) {
      throw new ForbiddenException('No puedes enviar mensajes en esta conversación.');
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
