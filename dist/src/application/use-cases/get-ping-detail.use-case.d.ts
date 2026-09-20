import { PingRepositoryPort } from '../../domain/ports/ping-repository.port';
import { PingViewRepositoryPort } from '../../domain/ports/ping-view-repository.port';
import { UserRepositoryPort } from '../../domain/ports/user-repository.port';
export interface PingDetailView {
    id: string;
    message: string;
    imageUrl?: string;
    color?: string;
    authorId: string;
    authorName: string;
    authorRole: string;
    latitude: number;
    longitude: number;
    radiusMeters: number;
    createdAt: Date;
    expiresAt: Date;
    status: string;
    isOwnPing: boolean;
    viewCount: number;
}
export declare class GetPingDetailUseCase {
    private readonly pingRepository;
    private readonly pingViewRepository;
    private readonly userRepository;
    constructor(pingRepository: PingRepositoryPort, pingViewRepository: PingViewRepositoryPort, userRepository: UserRepositoryPort);
    execute(pingId: string, viewerId: string | null): Promise<PingDetailView>;
}
