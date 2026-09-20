import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { ReportLocationUseCase } from '../../application/use-cases/report-location.use-case';
import { USER_LOCATION_REPOSITORY } from '../../domain/ports/user-location-repository.port';
import { USER_REPOSITORY } from '../../domain/ports/user-repository.port';
import { SETTINGS_REPOSITORY } from '../../domain/ports/settings-repository.port';
import { PrismaUserLocationRepository } from '../persistence/prisma-user-location.repository';
import { PrismaUserRepository } from '../persistence/prisma-user.repository';
import { PrismaSettingsRepository } from '../persistence/prisma-settings.repository';

@Module({
  controllers: [UserController],
  providers: [
    ReportLocationUseCase,
    { provide: USER_LOCATION_REPOSITORY, useClass: PrismaUserLocationRepository },
    { provide: USER_REPOSITORY, useClass: PrismaUserRepository },
    { provide: SETTINGS_REPOSITORY, useClass: PrismaSettingsRepository },
  ],
})
export class UserModule {}
