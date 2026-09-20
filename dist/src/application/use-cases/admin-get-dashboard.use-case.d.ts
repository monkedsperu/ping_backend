import { PrismaClient } from '@prisma/client';
import { PingRepositoryPort } from '../../domain/ports/ping-repository.port';
export interface AdminDashboard {
    totalUsers: number;
    disabledUsers: number;
    totalPings: number;
    activePings: number;
    totalThreads: number;
    totalMessages: number;
}
export declare class AdminGetDashboardUseCase {
    private readonly prisma;
    private readonly pingRepository;
    constructor(prisma: PrismaClient, pingRepository: PingRepositoryPort);
    execute(): Promise<AdminDashboard>;
}
