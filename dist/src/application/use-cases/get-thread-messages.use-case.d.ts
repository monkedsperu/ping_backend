import { PingRepositoryPort } from '../../domain/ports/ping-repository.port';
import { PingThreadRepositoryPort } from '../../domain/ports/ping-thread-repository.port';
import { ThreadMessageRepositoryPort } from '../../domain/ports/thread-message-repository.port';
import { UserRepositoryPort } from '../../domain/ports/user-repository.port';
export interface ThreadDetailView {
    pingId: string;
    pingMessage: string;
    pingIsActive: boolean;
    responderId: string;
    otherParticipantName: string;
    otherParticipantRole: string;
    messages: {
        id: string;
        senderId: string;
        message: string;
        imageUrl?: string;
        createdAt: Date;
    }[];
}
export declare class GetThreadMessagesUseCase {
    private readonly pingRepository;
    private readonly threadRepository;
    private readonly messageRepository;
    private readonly userRepository;
    constructor(pingRepository: PingRepositoryPort, threadRepository: PingThreadRepositoryPort, messageRepository: ThreadMessageRepositoryPort, userRepository: UserRepositoryPort);
    execute(pingId: string, responderIdInThread: string, viewerId: string): Promise<ThreadDetailView>;
}
