import { Inject, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PING_REPOSITORY, PingRepositoryPort } from '../../domain/ports/ping-repository.port';

export interface AdminDashboard {
  totalUsers: number;
  disabledUsers: number;
  totalPings: number;
  activePings: number;
  totalThreads: number;
  totalMessages: number;
}

@Injectable()
export class AdminGetDashboardUseCase {
  constructor(
    private readonly prisma: PrismaClient,
    @Inject(PING_REPOSITORY) private readonly pingRepository: PingRepositoryPort,
  ) {}

  async execute(): Promise<AdminDashboard> {
    const [totalUsers, disabledUsers, totalThreads, totalMessages, allPings] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({ where: { isDisabled: true } }),
      this.prisma.pingThread.count(),
      this.prisma.threadMessage.count(),
      this.pingRepository.findAll(),
    ]);

    const now = new Date();
    const activePings = allPings.filter((p) => p.isActive(now)).length;

    return {
      totalUsers,
      disabledUsers,
      totalPings: allPings.length,
      activePings,
      totalThreads,
      totalMessages,
    };
  }
}
