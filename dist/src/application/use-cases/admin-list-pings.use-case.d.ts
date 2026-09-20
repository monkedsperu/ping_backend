import { PingRepositoryPort } from '../../domain/ports/ping-repository.port';
import { PingThreadRepositoryPort } from '../../domain/ports/ping-thread-repository.port';
import { UserRepositoryPort } from '../../domain/ports/user-repository.port';
export interface AdminPingView {
    id: string;
    message: string;
    authorId: string;
    authorName: string;
    authorEmail: string;
    latitude: number;
    longitude: number;
    radiusMeters: number;
    status: string;
    isActive: boolean;
    threadCount: number;
    createdAt: Date;
    expiresAt: Date;
}
export declare class AdminListPingsUseCase {
    private readonly pingRepository;
    private readonly threadRepository;
    private readonly userRepository;
    constructor(pingRepository: PingRepositoryPort, threadRepository: PingThreadRepositoryPort, userRepository: UserRepositoryPort);
    execute(): Promise<AdminPingView[]>;
}
