import { Inject, Injectable } from '@nestjs/common';
import {
  USER_LOCATION_REPOSITORY,
  UserLocationRepositoryPort,
} from '../../domain/ports/user-location-repository.port';
import { USER_REPOSITORY, UserRepositoryPort } from '../../domain/ports/user-repository.port';
import {
  SETTINGS_REPOSITORY,
  SettingsRepositoryPort,
} from '../../domain/ports/settings-repository.port';
import { ReportLocationDto } from '../dto/report-location.dto';

@Injectable()
export class ReportLocationUseCase {
  constructor(
    @Inject(USER_LOCATION_REPOSITORY)
    private readonly userLocationRepository: UserLocationRepositoryPort,
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepositoryPort,
    @Inject(SETTINGS_REPOSITORY) private readonly settingsRepository: SettingsRepositoryPort,
  ) {}

  async execute(userId: string, dto: ReportLocationDto): Promise<void> {
    const user = await this.userRepository.findById(userId);
    const role = user?.role ?? 'user';
    const limits = await this.settingsRepository.getRoleLimits(role);

    // No rechazamos con error — esto se llama cada 5 minutos en segundo
    // plano, así que si alguien pidió un radio que su rol ya no permite,
    // simplemente lo recortamos en silencio al máximo permitido en vez
    // de romperle el reporte.
    const maxAllowed = Math.max(...limits.allowedListeningRadii);
    const listeningRadiusMeters = Math.min(dto.listeningRadiusMeters, maxAllowed);

    await this.userLocationRepository.upsert(
      userId,
      dto.pushToken,
      dto.latitude,
      dto.longitude,
      listeningRadiusMeters,
    );
  }
}
