import { CreatePingUseCase } from '../../application/use-cases/create-ping.use-case';
import { GetNearbyPingsUseCase } from '../../application/use-cases/get-nearby-pings.use-case';
import { GetPingDetailUseCase } from '../../application/use-cases/get-ping-detail.use-case';
import { StartThreadUseCase } from '../../application/use-cases/start-thread.use-case';
import { SendThreadMessageUseCase } from '../../application/use-cases/send-thread-message.use-case';
import { GetPingThreadsUseCase } from '../../application/use-cases/get-ping-threads.use-case';
import { GetMyPingsUseCase } from '../../application/use-cases/get-my-pings.use-case';
import { GetMyResponsesUseCase } from '../../application/use-cases/get-my-responses.use-case';
import { GetThreadMessagesUseCase } from '../../application/use-cases/get-thread-messages.use-case';
import { CreatePingDto } from '../../application/dto/create-ping.dto';
import { GetNearbyPingsDto } from '../../application/dto/get-nearby-pings.dto';
import { SendThreadMessageDto } from '../../application/dto/thread-message.dto';
export declare class PingController {
    private readonly createPing;
    private readonly getNearbyPings;
    private readonly getPingDetail;
    private readonly startThread;
    private readonly sendThreadMessage;
    private readonly getPingThreads;
    private readonly getMyPings;
    private readonly getMyResponses;
    private readonly getThreadMessages;
    constructor(createPing: CreatePingUseCase, getNearbyPings: GetNearbyPingsUseCase, getPingDetail: GetPingDetailUseCase, startThread: StartThreadUseCase, sendThreadMessage: SendThreadMessageUseCase, getPingThreads: GetPingThreadsUseCase, getMyPings: GetMyPingsUseCase, getMyResponses: GetMyResponsesUseCase, getThreadMessages: GetThreadMessagesUseCase);
    findNearby(viewerId: string | null, query: GetNearbyPingsDto): Promise<import("../../application/use-cases/get-nearby-pings.use-case").NearbyPingView[]>;
    findMine(authorId: string): Promise<import("../../application/use-cases/get-my-pings.use-case").MyPingView[]>;
    findMyResponses(responderId: string): Promise<import("../../application/use-cases/get-my-responses.use-case").MyResponseView[]>;
    findOne(viewerId: string | null, id: string): Promise<import("../../application/use-cases/get-ping-detail.use-case").PingDetailView>;
    create(authorId: string, dto: CreatePingDto): Promise<{
        id: string;
        notifiedCount: number;
        expiresAt: Date;
    }>;
    /** El autor ve la lista de conversaciones que le han abierto. */
    listThreads(viewerId: string, pingId: string): Promise<import("../../application/use-cases/get-ping-threads.use-case").ThreadSummaryView[]>;
    /** Iniciar una conversación nueva (primer mensaje de un respondiente). */
    createThread(responderId: string, pingId: string, dto: SendThreadMessageDto): Promise<Readonly<import("../../domain/entities/thread-message.entity").ThreadMessageProps>>;
    /** Ver los mensajes de un hilo (solo los dos participantes pueden). */
    getThread(viewerId: string, pingId: string, responderId: string): Promise<import("../../application/use-cases/get-thread-messages.use-case").ThreadDetailView>;
    /** Continuar una conversación existente. */
    replyInThread(senderId: string, pingId: string, responderId: string, dto: SendThreadMessageDto): Promise<Readonly<import("../../domain/entities/thread-message.entity").ThreadMessageProps>>;
}
