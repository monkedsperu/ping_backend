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

export interface ThreadDetailView {
  pingId: string;
  pingMessage: string;
  responderId: string;
  otherParticipantName: string;
  messages: {
    id: string;
    senderId: string;
    message: string;
    imageUrl?: string;
    createdAt: Date;
  }[];
}

@Injectable()
export class GetThreadMessagesUseCase {
  constructor(
    @Inject(PING_REPOSITORY) private readonly pingRepository: PingRepositoryPort,
    @Inject(PING_THREAD_REPOSITORY)
    private readonly threadRepository: PingThreadRepositoryPort,
    @Inject(THREAD_MESSAGE_REPOSITORY)
    private readonly messageRepository: ThreadMessageRepositoryPort,
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepositoryPort,
  ) {}

  async execute(
    pingId: string,
    responderIdInThread: string,
    viewerId: string,
  ): Promise<ThreadDetailView> {
    const ping = await this.pingRepository.findById(pingId);
    if (!ping) {
      throw new NotFoundException('El ping no existe.');
    }

    const thread = await this.threadRepository.findByPingAndResponder(
      pingId,
      responderIdInThread,
    );
    if (!thread) {
      throw new NotFoundException('Esta conversación no existe todavía.');
    }

    const isParticipant = viewerId === ping.authorId || viewerId === responderIdInThread;
    if (!isParticipant) {
      throw new ForbiddenException('No formas parte de esta conversación.');
    }

    const otherParticipantId = viewerId === ping.authorId ? responderIdInThread : ping.authorId;
    const [messages, otherParticipant] = await Promise.all([
      this.messageRepository.findByThreadId(thread.id),
      this.userRepository.findById(otherParticipantId),
    ]);

    return {
      pingId,
      pingMessage: ping.message,
      responderId: responderIdInThread,
      otherParticipantName: otherParticipant?.displayName ?? 'Usuario',
      messages: messages.map((m) => m.toProps()),
    };
  }
}
