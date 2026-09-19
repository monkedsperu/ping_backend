import { PrismaClient } from '@prisma/client';
import { PingViewRepositoryPort } from '../../domain/ports/ping-view-repository.port';
export declare class PrismaPingViewRepository implements PingViewRepositoryPort {
    private readonly prisma;
    constructor(prisma: PrismaClient);
    recordView(pingId: string, viewerId: string): Promise<void>;
    countViews(pingId: string): Promise<number>;
}
