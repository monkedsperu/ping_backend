import { ThreadMessage } from '../entities/thread-message.entity';
export interface ThreadMessageRepositoryPort {
    save(message: ThreadMessage): Promise<void>;
    findByThreadId(threadId: string): Promise<ThreadMessage[]>;
    findLastByThreadId(threadId: string): Promise<ThreadMessage | null>;
}
export declare const THREAD_MESSAGE_REPOSITORY: unique symbol;
