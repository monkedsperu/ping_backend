import { Ping } from '../../domain/entities/ping.entity';
import { PingRepositoryPort } from '../../domain/ports/ping-repository.port';
import { UserLocatorPort } from '../../domain/ports/user-locator.port';
import { NotificationPort } from '../../domain/ports/notification.port';
import { CreatePingDto } from '../dto/create-ping.dto';
export interface CreatePingResult {
    ping: Ping;
    notifiedCount: number;
}
/**
 * Caso de uso de aplicación. Solo conoce interfaces (ports), inyectadas por
 * NestJS. Esto es lo que permite testearlo con dobles de prueba (ver
 * test/application/create-ping.use-case.spec.ts) sin levantar Postgres
 * ni Firebase, y reemplazar cualquier adaptador sin tocar esta clase.
 */
export declare class CreatePingUseCase {
    private readonly pingRepository;
    private readonly userLocator;
    private readonly notifier;
    private readonly logger;
    constructor(pingRepository: PingRepositoryPort, userLocator: UserLocatorPort, notifier: NotificationPort);
    execute(dto: CreatePingDto, authorId: string): Promise<CreatePingResult>;
}
