import { UserRepositoryPort } from '../../domain/ports/user-repository.port';
import { PingRepositoryPort } from '../../domain/ports/ping-repository.port';
import { PingThreadRepositoryPort } from '../../domain/ports/ping-thread-repository.port';
export interface AdminUserDetail {
    id: string;
    email: string;
    displayName: string;
    role: string;
    isDisabled: boolean;
    hasGoogle: boolean;
    createdAt: Date;
    createdPings: {
        id: string;
        message: string;
        createdAt: Date;
        isActive: boolean;
        threadCount: number;
    }[];
    respondedTo: {
        pingId: string;
        pingMessage: string;
        pingAuthorId: string;
        respondedAt: Date;
    }[];
}
/** "Actividad de un usuario": qué anuncios ha creado y en cuáles ha
 * respondido — lo mínimo útil para entender el comportamiento de una
 * cuenta sin tener que cruzar tablas a mano. */
export declare class AdminGetUserDetailUseCase {
    private readonly userRepository;
    private readonly pingRepository;
    private readonly threadRepository;
    constructor(userRepository: UserRepositoryPort, pingRepository: PingRepositoryPort, threadRepository: PingThreadRepositoryPort);
    execute(userId: string): Promise<AdminUserDetail>;
}
