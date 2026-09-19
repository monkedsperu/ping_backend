import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';
import { PingViewRepositoryPort } from '../../domain/ports/ping-view-repository.port';

@Injectable()
export class PrismaPingViewRepository implements PingViewRepositoryPort {
  constructor(private readonly prisma: PrismaClient) {}

  async recordView(pingId: string, viewerId: string): Promise<void> {
    await this.prisma.pingView.upsert({
      where: { pingId_viewerId: { pingId, viewerId } },
      create: { id: randomUUID(), pingId, viewerId },
      update: {}, // ya existía — no hay nada que actualizar, solo no duplicar
    });
  }

  async countViews(pingId: string): Promise<number> {
    return this.prisma.pingView.count({ where: { pingId } });
  }
}
