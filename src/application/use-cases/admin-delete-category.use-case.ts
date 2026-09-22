import { Inject, Injectable } from '@nestjs/common';
import {
  SETTINGS_REPOSITORY,
  SettingsRepositoryPort,
} from '../../domain/ports/settings-repository.port';

@Injectable()
export class AdminDeleteCategoryUseCase {
  constructor(
    @Inject(SETTINGS_REPOSITORY) private readonly settingsRepository: SettingsRepositoryPort,
  ) {}

  execute(key: string) {
    return this.settingsRepository.deleteCategory(key);
  }
}
