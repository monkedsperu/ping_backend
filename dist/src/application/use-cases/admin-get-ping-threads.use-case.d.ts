import { PingRepositoryPort } from '../../domain/ports/ping-repository.port';
import { PingThreadRepositoryPort } from '../../domain/ports/ping-thread-repository.port';
import { ThreadMessageRepositoryPort } from '../../domain/ports/thread-message-repository.port';
import { UserRepositoryPort } from '../../domain/ports/user-repository.port';
export interface AdminThreadView {
    responderId: string;
    responderName: string;
    responderEmail: string;
    messageCount: number;
    lastMessage?: string;
    lastMessageAt?: Date;
}
/** Detalle de un ping para el panel de admin: el mensaje + todas sus
 * conversaciones (quién respondió y un resumen de cada una) — sin la
 * restricción de "solo el autor puede verlo" que sí aplica en la app. */
export declare class AdminGetPingThreadsUseCase {
    private readonly pingRepository;
    private readonly threadRepository;
    private readonly messageRepository;
    private readonly userRepository;
    constructor(pingRepository: PingRepositoryPort, threadRepository: PingThreadRepositoryPort, messageRepository: ThreadMessageRepositoryPort, userRepository: UserRepositoryPort);
    execute(pingId: string): Promise<AdminThreadView[]>;
}
