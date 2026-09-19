import { PingRepositoryPort } from '../../domain/ports/ping-repository.port';
import { PingThreadRepositoryPort } from '../../domain/ports/ping-thread-repository.port';
import { ThreadMessageRepositoryPort } from '../../domain/ports/thread-message-repository.port';
import { UserRepositoryPort } from '../../domain/ports/user-repository.port';
export interface ThreadSummaryView {
    responderId: string;
    responderName: string;
    lastMessage: string;
    lastMessageAt: Date;
}
export declare class GetPingThreadsUseCase {
    private readonly pingRepository;
    private readonly threadRepository;
    private readonly messageRepository;
    private readonly userRepository;
    constructor(pingRepository: PingRepositoryPort, threadRepository: PingThreadRepositoryPort, messageRepository: ThreadMessageRepositoryPort, userRepository: UserRepositoryPort);
    execute(pingId: string, viewerId: string): Promise<ThreadSummaryView[]>;
}
