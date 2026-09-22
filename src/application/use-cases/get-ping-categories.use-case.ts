import { Inject, Injectable } from '@nestjs/common';
import {
  SETTINGS_REPOSITORY,
  SettingsRepositoryPort,
} from '../../domain/ports/settings-repository.port';

/** Público — lo usa tanto el picker de "crear anuncio" como el filtro
 * del Home, con o sin sesión iniciada. */
@Injectable()
export class GetPingCategoriesUseCase {
  constructor(
    @Inject(SETTINGS_REPOSITORY) private readonly settingsRepository: SettingsRepositoryPort,
  ) {}

  execute() {
    return this.settingsRepository.getActiveCategories();
  }
}
