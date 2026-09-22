import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { ReportLocationUseCase } from '../../application/use-cases/report-location.use-case';
import { CreateReportUseCase } from '../../application/use-cases/create-report.use-case';
import { BlockUserUseCase } from '../../application/use-cases/block-user.use-case';
import { UnblockUserUseCase } from '../../application/use-cases/unblock-user.use-case';
import { ListMyBlocksUseCase } from '../../application/use-cases/list-my-blocks.use-case';
import { UpdateVisibleCategoriesUseCase } from '../../application/use-cases/update-visible-categories.use-case';
import { USER_LOCATION_REPOSITORY } from '../../domain/ports/user-location-repository.port';
import { USER_REPOSITORY } from '../../domain/ports/user-repository.port';
import { SETTINGS_REPOSITORY } from '../../domain/ports/settings-repository.port';
import { REPORT_REPOSITORY } from '../../domain/ports/report-repository.port';
import { USER_BLOCK_REPOSITORY } from '../../domain/ports/user-block-repository.port';
import { PrismaUserLocationRepository } from '../persistence/prisma-user-location.repository';
import { PrismaUserRepository } from '../persistence/prisma-user.repository';
import { PrismaSettingsRepository } from '../persistence/prisma-settings.repository';
import { PrismaReportRepository } from '../persistence/prisma-report.repository';
import { PrismaUserBlockRepository } from '../persistence/prisma-user-block.repository';

@Module({
  controllers: [UserController],
  providers: [
    ReportLocationUseCase,
    CreateReportUseCase,
    BlockUserUseCase,
    UnblockUserUseCase,
    ListMyBlocksUseCase,
    UpdateVisibleCategoriesUseCase,
    { provide: USER_LOCATION_REPOSITORY, useClass: PrismaUserLocationRepository },
    { provide: USER_REPOSITORY, useClass: PrismaUserRepository },
    { provide: SETTINGS_REPOSITORY, useClass: PrismaSettingsRepository },
    { provide: REPORT_REPOSITORY, useClass: PrismaReportRepository },
    { provide: USER_BLOCK_REPOSITORY, useClass: PrismaUserBlockRepository },
  ],
})
export class UserModule {}
