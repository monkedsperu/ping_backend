import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ThreadMessage } from '../../domain/entities/thread-message.entity';
import { ThreadMessageRepositoryPort } from '../../domain/ports/thread-message-repository.port';

@Injectable()
export class PrismaThreadMessageRepository implements ThreadMessageRepositoryPort {
  constructor(private readonly prisma: PrismaClient) {}

  async save(message: ThreadMessage): Promise<void> {
    const m = message.toProps();
    await this.prisma.threadMessage.create({
      data: {
        id: m.id,
        threadId: m.threadId,
        senderId: m.senderId,
        message: m.message,
        imageUrl: m.imageUrl ?? null,
        createdAt: m.createdAt,
      },
    });
  }

  async findByThreadId(threadId: string): Promise<ThreadMessage[]> {
    const rows = await this.prisma.threadMessage.findMany({
      where: { threadId },
      orderBy: { createdAt: 'asc' },
    });
    return rows.map((row) => this.toDomain(row));
  }

  async findLastByThreadId(threadId: string): Promise<ThreadMessage | null> {
    const row = await this.prisma.threadMessage.findFirst({
      where: { threadId },
      orderBy: { createdAt: 'desc' },
    });
    return row ? this.toDomain(row) : null;
  }

  private toDomain(row: {
    id: string;
    threadId: string;
    senderId: string;
    message: string;
    imageUrl: string | null;
    createdAt: Date;
  }): ThreadMessage {
    return ThreadMessage.reconstitute({
      id: row.id,
      threadId: row.threadId,
      senderId: row.senderId,
      message: row.message,
      imageUrl: row.imageUrl ?? undefined,
      createdAt: row.createdAt,
    });
  }
}
