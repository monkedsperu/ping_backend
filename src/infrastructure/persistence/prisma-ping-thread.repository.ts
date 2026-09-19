import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import {
  PingThreadRepositoryPort,
  PingThreadSummary,
} from '../../domain/ports/ping-thread-repository.port';

@Injectable()
export class PrismaPingThreadRepository implements PingThreadRepositoryPort {
  constructor(private readonly prisma: PrismaClient) {}

  async create(pingId: string, responderId: string): Promise<PingThreadSummary> {
    return this.prisma.pingThread.create({ data: { pingId, responderId } });
  }

  async findByPingAndResponder(
    pingId: string,
    responderId: string,
  ): Promise<PingThreadSummary | null> {
    return this.prisma.pingThread.findUnique({
      where: { pingId_responderId: { pingId, responderId } },
    });
  }

  async findById(threadId: string): Promise<PingThreadSummary | null> {
    return this.prisma.pingThread.findUnique({ where: { id: threadId } });
  }

  async findByPingId(pingId: string): Promise<PingThreadSummary[]> {
    return this.prisma.pingThread.findMany({
      where: { pingId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByResponderId(responderId: string): Promise<PingThreadSummary[]> {
    return this.prisma.pingThread.findMany({
      where: { responderId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
