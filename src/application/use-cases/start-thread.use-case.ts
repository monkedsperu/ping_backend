import {
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

@Injectable()
export class StartThreadUseCase {
  constructor(
    @Inject(PING_REPOSITORY) private readonly pingRepository: PingRepositoryPort,
    @Inject(PING_THREAD_REPOSITORY)
    private readonly threadRepository: PingThreadRepositoryPort,
    @Inject(THREAD_MESSAGE_REPOSITORY)
    private readonly messageRepository: ThreadMessageRepositoryPort,
  ) {}

  async execute(
    pingId: string,
    dto: SendThreadMessageDto,
    responderId: string,
  ): Promise<{ threadId: string; message: ThreadMessage }> {
    const ping = await this.pingRepository.findById(pingId);
    if (!ping) {
      throw new NotFoundException('El ping no existe.');
    }
    if (!ping.isActive(new Date())) {
      throw new ForbiddenException('Este ping ya expiró; no se pueden abrir conversaciones nuevas.');
    }
    if (ping.authorId === responderId) {
      throw new ForbiddenException('No puedes responder tu propio ping.');
    }

    const existing = await this.threadRepository.findByPingAndResponder(pingId, responderId);
    if (existing) {
      throw new ConflictException(
        'Ya tienes una conversación abierta en este ping. Continúala en vez de iniciar otra.',
      );
    }

    const thread = await this.threadRepository.create(pingId, responderId);

    const message = ThreadMessage.create({
      id: randomUUID(),
      threadId: thread.id,
      senderId: responderId,
      message: dto.message,
      imageUrl: dto.imageUrl,
      now: new Date(),
    });

    await this.messageRepository.save(message);
    return { threadId: thread.id, message };
  }
}
