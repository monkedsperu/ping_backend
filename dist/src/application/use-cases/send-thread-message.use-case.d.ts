import { ThreadMessage } from '../../domain/entities/thread-message.entity';
import { PingRepositoryPort } from '../../domain/ports/ping-repository.port';
import { PingThreadRepositoryPort } from '../../domain/ports/ping-thread-repository.port';
import { ThreadMessageRepositoryPort } from '../../domain/ports/thread-message-repository.port';
import { SendThreadMessageDto } from '../dto/thread-message.dto';
/**
 * Un hilo tiene exactamente dos participantes posibles: el autor del ping
 * y el respondiente original. Cualquier otra persona que intente escribir
 * ahí (incluso otro usuario autenticado válido) debe ser rechazada — esto
 * es lo que mantiene cada conversación privada entre esos dos.
 */
export declare class SendThreadMessageUseCase {
    private readonly pingRepository;
    private readonly threadRepository;
    private readonly messageRepository;
    constructor(pingRepository: PingRepositoryPort, threadRepository: PingThreadRepositoryPort, messageRepository: ThreadMessageRepositoryPort);
    execute(pingId: string, responderIdInThread: string, dto: SendThreadMessageDto, senderId: string): Promise<ThreadMessage>;
}
