import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { ReportLocationUseCase } from '../../application/use-cases/report-location.use-case';
import { USER_LOCATION_REPOSITORY } from '../../domain/ports/user-location-repository.port';
import { PrismaUserLocationRepository } from '../persistence/prisma-user-location.repository';

@Module({
  controllers: [UserController],
  providers: [
    ReportLocationUseCase,
    { provide: USER_LOCATION_REPOSITORY, useClass: PrismaUserLocationRepository },
  ],
})
export class UserModule {}
