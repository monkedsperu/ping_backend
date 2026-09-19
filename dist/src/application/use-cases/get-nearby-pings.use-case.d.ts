import { PingRepositoryPort } from '../../domain/ports/ping-repository.port';
import { PingThreadRepositoryPort } from '../../domain/ports/ping-thread-repository.port';
import { UserRepositoryPort } from '../../domain/ports/user-repository.port';
import { GetNearbyPingsDto } from '../dto/get-nearby-pings.dto';
export interface NearbyPingView {
    id: string;
    message: string;
    imageUrl?: string;
    color?: string;
    authorName: string;
    latitude: number;
    longitude: number;
    radiusMeters: number;
    distanceMeters: number;
    createdAt: Date;
    expiresAt: Date;
    isOwnPing: boolean;
    threadCount: number;
}
/**
 * viewerId es opcional (navegación sin cuenta). Solo cuando hay viewer
 * identificado calculamos isOwnPing/threadCount, y solo para SUS PROPIOS
 * pings — no tiene sentido consultar hilos de pings ajenos solo para
 * mostrar la lista. authorName sí se resuelve siempre, para todos.
 */
export declare class GetNearbyPingsUseCase {
    private readonly pingRepository;
    private readonly threadRepository;
    private readonly userRepository;
    constructor(pingRepository: PingRepositoryPort, threadRepository: PingThreadRepositoryPort, userRepository: UserRepositoryPort);
    execute(dto: GetNearbyPingsDto, viewerId: string | null): Promise<NearbyPingView[]>;
}
