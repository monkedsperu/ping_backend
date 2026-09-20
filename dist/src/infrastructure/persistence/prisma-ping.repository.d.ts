import { PrismaClient } from '@prisma/client';
import { Ping } from '../../domain/entities/ping.entity';
import { GeoPoint } from '../../domain/value-objects/geo-point.vo';
import { PingRepositoryPort } from '../../domain/ports/ping-repository.port';
export declare class PrismaPingRepository implements PingRepositoryPort {
    private readonly prisma;
    constructor(prisma: PrismaClient);
    save(ping: Ping): Promise<void>;
    findById(id: string): Promise<Ping | null>;
    findByAuthorId(authorId: string): Promise<Ping[]>;
    findAll(): Promise<Ping[]>;
    findCollidingWithListeningArea(center: GeoPoint, listeningRadiusMeters: number): Promise<Ping[]>;
    private toDomain;
}
