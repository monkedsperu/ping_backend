import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';
import { UserBlockRecord, UserBlockRepositoryPort } from '../../domain/ports/user-block-repository.port';

@Injectable()
export class PrismaUserBlockRepository implements UserBlockRepositoryPort {
  constructor(private readonly prisma: PrismaClient) {}

  async block(blockerId: string, blockedId: string, now: Date): Promise<void> {
    await this.prisma.userBlock.upsert({
      where: { blockerId_blockedId: { blockerId, blockedId } },
      create: { id: randomUUID(), blockerId, blockedId, createdAt: now },
      update: {},
    });
  }

  async unblock(blockerId: string, blockedId: string): Promise<void> {
    await this.prisma.userBlock
      .delete({ where: { blockerId_blockedId: { blockerId, blockedId } } })
      .catch(() => {
        // no existía el bloqueo — no es un error para quien llama.
      });
  }

  async isBlockedEitherWay(userIdA: string, userIdB: string): Promise<boolean> {
    const count = await this.prisma.userBlock.count({
      where: {
        OR: [
          { blockerId: userIdA, blockedId: userIdB },
          { blockerId: userIdB, blockedId: userIdA },
        ],
      },
    });
    return count > 0;
  }

  async findBlockedIdsByUser(userId: string): Promise<string[]> {
    const rows = await this.prisma.userBlock.findMany({
      where: { blockerId: userId },
      select: { blockedId: true },
    });
    return rows.map((r) => r.blockedId);
  }

  async findMyBlocks(userId: string): Promise<UserBlockRecord[]> {
    const rows = await this.prisma.userBlock.findMany({
      where: { blockerId: userId },
      orderBy: { createdAt: 'desc' },
    });
    return rows;
  }

  async findAll(): Promise<UserBlockRecord[]> {
    const rows = await this.prisma.userBlock.findMany({ orderBy: { createdAt: 'desc' } });
    return rows;
  }
}
