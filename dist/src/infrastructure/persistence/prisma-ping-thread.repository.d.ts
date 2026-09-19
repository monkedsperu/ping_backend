import { PrismaClient } from '@prisma/client';
import { PingThreadRepositoryPort, PingThreadSummary } from '../../domain/ports/ping-thread-repository.port';
export declare class PrismaPingThreadRepository implements PingThreadRepositoryPort {
    private readonly prisma;
    constructor(prisma: PrismaClient);
    create(pingId: string, responderId: string): Promise<PingThreadSummary>;
    findByPingAndResponder(pingId: string, responderId: string): Promise<PingThreadSummary | null>;
    findById(threadId: string): Promise<PingThreadSummary | null>;
    findByPingId(pingId: string): Promise<PingThreadSummary[]>;
    findByResponderId(responderId: string): Promise<PingThreadSummary[]>;
}
