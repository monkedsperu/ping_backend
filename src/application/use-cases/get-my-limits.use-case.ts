import { Inject, Injectable } from '@nestjs/common';
import { USER_REPOSITORY, UserRepositoryPort } from '../../domain/ports/user-repository.port';
import {
  SETTINGS_REPOSITORY,
  SettingsRepositoryPort,
  PingCategoryValue,
} from '../../domain/ports/settings-repository.port';
import {
  SOCIAL_PING_RADII,
  SOCIAL_DURATIONS,
  SOCIAL_MAX_LISTENERS,
} from '../../domain/entities/role-limits.defaults';

export interface MyLimitsView {
  role: string;
  allowedPingRadii: number[];
  allowedListeningRadii: number[];
  allowedDurations: number[];
  socialPingRadii: number[];
  socialDurations: number[];
  maxListenersPerPing: number;
  socialMaxListeners: number;
  minMessageLength: number;
  maxMessageLength: number;
  categories: PingCategoryValue[];
  /** Vacío = "sin sesión" o "quiero ver todas". */
  visibleCategories: string[];
}

/**
 * Esto es lo que la app le pregunta al servidor al abrir "crear anuncio"
 * o el selector de radio de escucha — así la pantalla muestra lo que de
 * verdad puede elegir este usuario, en vez de una lista fija adivinada
 * en el cliente. Sin sesión (navegando sin cuenta), se responde como
 * rol "user".
 */
@Injectable()
export class GetMyLimitsUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepositoryPort,
    @Inject(SETTINGS_REPOSITORY) private readonly settingsRepository: SettingsRepositoryPort,
  ) {}

  async execute(userId: string | null): Promise<MyLimitsView> {
    const user = userId ? await this.userRepository.findById(userId) : null;
    const role = user?.role ?? 'user';

    const [roleLimits, messageLimits, categories] = await Promise.all([
      this.settingsRepository.getRoleLimits(role),
      this.settingsRepository.getMessageLimits(),
      this.settingsRepository.getActiveCategories(),
    ]);

    return {
      role,
      allowedPingRadii: roleLimits.allowedPingRadii,
      allowedListeningRadii: roleLimits.allowedListeningRadii,
      allowedDurations: roleLimits.allowedDurations,
      socialPingRadii: SOCIAL_PING_RADII,
      socialDurations: SOCIAL_DURATIONS,
      maxListenersPerPing: roleLimits.maxListenersPerPing,
      socialMaxListeners: SOCIAL_MAX_LISTENERS,
      minMessageLength: messageLimits.minMessageLength,
      maxMessageLength: messageLimits.maxMessageLength,
      categories,
      visibleCategories: user?.visibleCategories ?? [],
    };
  }
}
