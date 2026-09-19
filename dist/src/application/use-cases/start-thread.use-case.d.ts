import { ThreadMessage } from '../../domain/entities/thread-message.entity';
import { PingRepositoryPort } from '../../domain/ports/ping-repository.port';
import { PingThreadRepositoryPort } from '../../domain/ports/ping-thread-repository.port';
import { ThreadMessageRepositoryPort } from '../../domain/ports/thread-message-repository.port';
import { SendThreadMessageDto } from '../dto/thread-message.dto';
export declare class StartThreadUseCase {
    private readonly pingRepository;
    private readonly threadRepository;
    private readonly messageRepository;
    constructor(pingRepository: PingRepositoryPort, threadRepository: PingThreadRepositoryPort, messageRepository: ThreadMessageRepositoryPort);
    execute(pingId: string, dto: SendThreadMessageDto, responderId: string): Promise<{
        threadId: string;
        message: ThreadMessage;
    }>;
}
