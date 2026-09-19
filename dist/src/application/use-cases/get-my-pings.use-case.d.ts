import { PingRepositoryPort } from '../../domain/ports/ping-repository.port';
import { PingThreadRepositoryPort } from '../../domain/ports/ping-thread-repository.port';
export interface MyPingView {
    id: string;
    message: string;
    imageUrl?: string;
    color?: string;
    radiusMeters: number;
    createdAt: Date;
    expiresAt: Date;
    status: string;
    isActive: boolean;
    threadCount: number;
}
/**
 * "Mis pings": tus conversaciones no deberían desaparecer solo porque tu
 * círculo de escucha ya no cubre un ping que pusiste en otro lado del
 * mapa. Esta lista es independiente de esa ubicación/radio actual.
 */
export declare class GetMyPingsUseCase {
    private readonly pingRepository;
    private readonly threadRepository;
    constructor(pingRepository: PingRepositoryPort, threadRepository: PingThreadRepositoryPort);
    execute(authorId: string): Promise<MyPingView[]>;
}
