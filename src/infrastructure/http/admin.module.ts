import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminGuard } from '../auth/admin.guard';
import { SuperAdminGuard } from '../auth/super-admin.guard';
import { AdminGetDashboardUseCase } from '../../application/use-cases/admin-get-dashboard.use-case';
import { AdminGetTimeseriesUseCase } from '../../application/use-cases/admin-get-timeseries.use-case';
import { AdminListUsersUseCase } from '../../application/use-cases/admin-list-users.use-case';
import { AdminSetUserDisabledUseCase } from '../../application/use-cases/admin-set-user-disabled.use-case';
import { AdminSetUserRoleUseCase } from '../../application/use-cases/admin-set-user-role.use-case';
import { AdminGetUserDetailUseCase } from '../../application/use-cases/admin-get-user-detail.use-case';
import { AdminListPingsUseCase } from '../../application/use-cases/admin-list-pings.use-case';
import { AdminGetPingUseCase } from '../../application/use-cases/admin-get-ping.use-case';
import { AdminGetPingThreadsUseCase } from '../../application/use-cases/admin-get-ping-threads.use-case';
import { AdminGetConversationUseCase } from '../../application/use-cases/admin-get-conversation.use-case';
import { PING_REPOSITORY } from '../../domain/ports/ping-repository.port';
import { PING_VIEW_REPOSITORY } from '../../domain/ports/ping-view-repository.port';
import { PING_THREAD_REPOSITORY } from '../../domain/ports/ping-thread-repository.port';
import { THREAD_MESSAGE_REPOSITORY } from '../../domain/ports/thread-message-repository.port';
import { USER_REPOSITORY } from '../../domain/ports/user-repository.port';
import { SETTINGS_REPOSITORY } from '../../domain/ports/settings-repository.port';
import { PrismaPingRepository } from '../persistence/prisma-ping.repository';
import { PrismaPingViewRepository } from '../persistence/prisma-ping-view.repository';
import { PrismaPingThreadRepository } from '../persistence/prisma-ping-thread.repository';
import { PrismaThreadMessageRepository } from '../persistence/prisma-thread-message.repository';
import { PrismaUserRepository } from '../persistence/prisma-user.repository';
import { PrismaSettingsRepository } from '../persistence/prisma-settings.repository';

@Module({
  controllers: [AdminController],
  providers: [
    AdminGuard,
    SuperAdminGuard,
    AdminGetDashboardUseCase,
    AdminGetTimeseriesUseCase,
    AdminListUsersUseCase,
    AdminSetUserDisabledUseCase,
    AdminSetUserRoleUseCase,
    AdminGetUserDetailUseCase,
    AdminListPingsUseCase,
    AdminGetPingUseCase,
    AdminGetPingThreadsUseCase,
    AdminGetConversationUseCase,
    { provide: PING_REPOSITORY, useClass: PrismaPingRepository },
    { provide: PING_VIEW_REPOSITORY, useClass: PrismaPingViewRepository },
    { provide: PING_THREAD_REPOSITORY, useClass: PrismaPingThreadRepository },
    { provide: THREAD_MESSAGE_REPOSITORY, useClass: PrismaThreadMessageRepository },
    { provide: USER_REPOSITORY, useClass: PrismaUserRepository },
    { provide: SETTINGS_REPOSITORY, useClass: PrismaSettingsRepository },
  ],
})
export class AdminModule {}
