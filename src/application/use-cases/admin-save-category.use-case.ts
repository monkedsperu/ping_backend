import { Inject, Injectable } from '@nestjs/common';
import {
  SETTINGS_REPOSITORY,
  SettingsRepositoryPort,
} from '../../domain/ports/settings-repository.port';
import { SaveCategoryDto } from '../dto/save-category.dto';

@Injectable()
export class AdminSaveCategoryUseCase {
  constructor(
    @Inject(SETTINGS_REPOSITORY) private readonly settingsRepository: SettingsRepositoryPort,
  ) {}

  execute(key: string, dto: SaveCategoryDto) {
    return this.settingsRepository.saveCategory({ key, ...dto });
  }
}
