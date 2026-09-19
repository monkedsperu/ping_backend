import { PingRepositoryPort } from '../../domain/ports/ping-repository.port';
import { PingThreadRepositoryPort } from '../../domain/ports/ping-thread-repository.port';
import { ThreadMessageRepositoryPort } from '../../domain/ports/thread-message-repository.port';
import { UserRepositoryPort } from '../../domain/ports/user-repository.port';
export interface MyResponseView {
    pingId: string;
    responderId: string;
    pingMessage: string;
    authorName: string;
    color?: string;
    lastMessage: string;
    lastMessageAt: Date;
    isPingActive: boolean;
    pingExpiresAt: Date;
}
/**
 * "Mis respuestas": una conversación que ya empezaste no debería
 * desaparecer solo porque tu radio de escucha ya no cubre ese ping —
 * esta lista es tu forma de encontrarla de nuevo, hasta que expire.
 */
export declare class GetMyResponsesUseCase {
    private readonly pingRepository;
    private readonly threadRepository;
    private readonly messageRepository;
    private readonly userRepository;
    constructor(pingRepository: PingRepositoryPort, threadRepository: PingThreadRepositoryPort, messageRepository: ThreadMessageRepositoryPort, userRepository: UserRepositoryPort);
    execute(responderId: string): Promise<MyResponseView[]>;
}
