import { Inject, Injectable } from '@nestjs/common';
import {
  USER_LOCATION_REPOSITORY,
  UserLocationRepositoryPort,
} from '../../domain/ports/user-location-repository.port';
import { ReportLocationDto } from '../dto/report-location.dto';

@Injectable()
export class ReportLocationUseCase {
  constructor(
    @Inject(USER_LOCATION_REPOSITORY)
    private readonly userLocationRepository: UserLocationRepositoryPort,
  ) {}

  async execute(userId: string, dto: ReportLocationDto): Promise<void> {
    await this.userLocationRepository.upsert(
      userId,
      dto.pushToken,
      dto.latitude,
      dto.longitude,
      dto.listeningRadiusMeters,
    );
  }
}
