import { PrismaClient } from '@prisma/client';
import { GeoPoint } from '../../domain/value-objects/geo-point.vo';
import { NearbyUser, UserLocatorPort } from '../../domain/ports/user-locator.port';
export declare class PrismaUserLocatorRepository implements UserLocatorPort {
    private readonly prisma;
    constructor(prisma: PrismaClient);
    findUsersCollidingWithPing(pingCenter: GeoPoint, pingRadiusMeters: number, excludeUserId: string): Promise<NearbyUser[]>;
}
