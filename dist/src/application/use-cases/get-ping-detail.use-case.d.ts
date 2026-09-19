import { PingRepositoryPort } from '../../domain/ports/ping-repository.port';
export interface PingDetailView {
    id: string;
    message: string;
    imageUrl?: string;
    color?: string;
    authorId: string;
    latitude: number;
    longitude: number;
    radiusMeters: number;
    createdAt: Date;
    expiresAt: Date;
    status: string;
    isOwnPing: boolean;
}
/**
 * viewerId puede ser null (alguien navegando sin sesión). En ese caso
 * isOwnPing siempre es false — nadie sin cuenta puede ser autor de nada.
 */
export declare class GetPingDetailUseCase {
    private readonly pingRepository;
    constructor(pingRepository: PingRepositoryPort);
    execute(pingId: string, viewerId: string | null): Promise<PingDetailView>;
}
