import { PingRepositoryPort } from '../../domain/ports/ping-repository.port';
import { UserRepositoryPort } from '../../domain/ports/user-repository.port';
import { PingViewRepositoryPort } from '../../domain/ports/ping-view-repository.port';
import { PingThreadRepositoryPort } from '../../domain/ports/ping-thread-repository.port';
export interface AdminPingDetail {
    id: string;
    message: string;
    imageUrl?: string;
    authorId: string;
    authorName: string;
    authorEmail: string;
    latitude: number;
    longitude: number;
    radiusMeters: number;
    isSocial: boolean;
    status: string;
    isActive: boolean;
    durationMinutes: number;
    viewCount: number;
    threadCount: number;
    createdAt: Date;
    expiresAt: Date;
}
/** A diferencia de GetPingDetailUseCase (el que usa la app), este NO
 * registra una vista — el admin navegando no debe inflar el contador. */
export declare class AdminGetPingUseCase {
    private readonly pingRepository;
    private readonly userRepository;
    private readonly pingViewRepository;
    private readonly threadRepository;
    constructor(pingRepository: PingRepositoryPort, userRepository: UserRepositoryPort, pingViewRepository: PingViewRepositoryPort, threadRepository: PingThreadRepositoryPort);
    execute(pingId: string): Promise<AdminPingDetail>;
}
