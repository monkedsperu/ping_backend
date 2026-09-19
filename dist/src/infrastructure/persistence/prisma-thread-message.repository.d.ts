import { PrismaClient } from '@prisma/client';
import { ThreadMessage } from '../../domain/entities/thread-message.entity';
import { ThreadMessageRepositoryPort } from '../../domain/ports/thread-message-repository.port';
export declare class PrismaThreadMessageRepository implements ThreadMessageRepositoryPort {
    private readonly prisma;
    constructor(prisma: PrismaClient);
    save(message: ThreadMessage): Promise<void>;
    findByThreadId(threadId: string): Promise<ThreadMessage[]>;
    findLastByThreadId(threadId: string): Promise<ThreadMessage | null>;
    private toDomain;
}
