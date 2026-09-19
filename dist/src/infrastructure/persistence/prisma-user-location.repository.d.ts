import { PrismaClient } from '@prisma/client';
import { UserLocationRepositoryPort } from '../../domain/ports/user-location-repository.port';
export declare class PrismaUserLocationRepository implements UserLocationRepositoryPort {
    private readonly prisma;
    constructor(prisma: PrismaClient);
    upsert(userId: string, pushToken: string, latitude: number, longitude: number, listeningRadiusMeters: number): Promise<void>;
}
