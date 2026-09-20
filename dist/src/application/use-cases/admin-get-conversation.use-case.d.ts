import { PingThreadRepositoryPort } from '../../domain/ports/ping-thread-repository.port';
import { ThreadMessageRepositoryPort } from '../../domain/ports/thread-message-repository.port';
import { PingRepositoryPort } from '../../domain/ports/ping-repository.port';
import { UserRepositoryPort } from '../../domain/ports/user-repository.port';
export interface AdminMessageView {
    id: string;
    senderId: string;
    senderName: string;
    message: string;
    imageUrl?: string;
    createdAt: Date;
}
/** El historial completo de una conversación puntual — para auditoría.
 * Sí, se guarda cada mensaje con su remitente y fecha, para siempre
 * (mientras el ping/thread no se borre de la base). */
export declare class AdminGetConversationUseCase {
    private readonly threadRepository;
    private readonly messageRepository;
    private readonly pingRepository;
    private readonly userRepository;
    constructor(threadRepository: PingThreadRepositoryPort, messageRepository: ThreadMessageRepositoryPort, pingRepository: PingRepositoryPort, userRepository: UserRepositoryPort);
    execute(pingId: string, responderId: string): Promise<AdminMessageView[]>;
}
