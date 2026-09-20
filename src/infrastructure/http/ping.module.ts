import { Module } from '@nestjs/common';
import { PingController } from './ping.controller';
import { CreatePingUseCase } from '../../application/use-cases/create-ping.use-case';
import { GetNearbyPingsUseCase } from '../../application/use-cases/get-nearby-pings.use-case';
import { GetPingDetailUseCase } from '../../application/use-cases/get-ping-detail.use-case';
import { StartThreadUseCase } from '../../application/use-cases/start-thread.use-case';
import { SendThreadMessageUseCase } from '../../application/use-cases/send-thread-message.use-case';
import { GetPingThreadsUseCase } from '../../application/use-cases/get-ping-threads.use-case';
import { GetMyPingsUseCase } from '../../application/use-cases/get-my-pings.use-case';
import { GetMyResponsesUseCase } from '../../application/use-cases/get-my-responses.use-case';
import { GetThreadMessagesUseCase } from '../../application/use-cases/get-thread-messages.use-case';
import { PING_REPOSITORY } from '../../domain/ports/ping-repository.port';
import { PING_THREAD_REPOSITORY } from '../../domain/ports/ping-thread-repository.port';
import { PING_VIEW_REPOSITORY } from '../../domain/ports/ping-view-repository.port';
import { SETTINGS_REPOSITORY } from '../../domain/ports/settings-repository.port';
import { THREAD_MESSAGE_REPOSITORY } from '../../domain/ports/thread-message-repository.port';
import { USER_REPOSITORY } from '../../domain/ports/user-repository.port';
import { USER_LOCATOR } from '../../domain/ports/user-locator.port';
import { NOTIFICATION_SENDER } from '../../domain/ports/notification.port';
import { PrismaPingRepository } from '../persistence/prisma-ping.repository';
import { PrismaPingThreadRepository } from '../persistence/prisma-ping-thread.repository';
import { PrismaPingViewRepository } from '../persistence/prisma-ping-view.repository';
import { PrismaSettingsRepository } from '../persistence/prisma-settings.repository';
import { PrismaThreadMessageRepository } from '../persistence/prisma-thread-message.repository';
import { PrismaUserRepository } from '../persistence/prisma-user.repository';
import { PrismaUserLocatorRepository } from '../persistence/prisma-user-locator.repository';
import { FcmNotificationAdapter } from '../notifications/fcm-notification.adapter';

/**
 * Este es el único archivo del proyecto que "sabe" qué adaptador concreto
 * cumple cada puerto. Cambiar de Postgres a otra base, o de FCM a otro
 * proveedor push, es reemplazar el `useClass` de abajo — nada más.
 */
@Module({
  controllers: [PingController],
  providers: [
    CreatePingUseCase,
    GetNearbyPingsUseCase,
    GetPingDetailUseCase,
    StartThreadUseCase,
    SendThreadMessageUseCase,
    GetPingThreadsUseCase,
    GetMyPingsUseCase,
    GetMyResponsesUseCase,
    GetThreadMessagesUseCase,
    { provide: PING_REPOSITORY, useClass: PrismaPingRepository },
    { provide: PING_THREAD_REPOSITORY, useClass: PrismaPingThreadRepository },
    { provide: PING_VIEW_REPOSITORY, useClass: PrismaPingViewRepository },
    { provide: SETTINGS_REPOSITORY, useClass: PrismaSettingsRepository },
    { provide: THREAD_MESSAGE_REPOSITORY, useClass: PrismaThreadMessageRepository },
    { provide: USER_REPOSITORY, useClass: PrismaUserRepository },
    { provide: USER_LOCATOR, useClass: PrismaUserLocatorRepository },
    { provide: NOTIFICATION_SENDER, useClass: FcmNotificationAdapter },
  ],
})
export class PingModule {}
