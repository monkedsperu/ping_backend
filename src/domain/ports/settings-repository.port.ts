import { RoleLimitsValue } from '../entities/role-limits.defaults';
import { UserRole } from '../entities/user.entity';

export interface MessageLimitsValue {
  minMessageLength: number;
  maxMessageLength: number;
}

export interface PingCategoryValue {
  key: string;
  label: string;
  icon?: string;
  isActive: boolean;
  sortOrder: number;
}

export interface SettingsRepositoryPort {
  getRoleLimits(role: UserRole): Promise<RoleLimitsValue>;
  getAllRoleLimits(): Promise<RoleLimitsValue[]>;
  saveRoleLimits(value: RoleLimitsValue): Promise<void>;

  getMessageLimits(): Promise<MessageLimitsValue>;
  saveMessageLimits(value: MessageLimitsValue): Promise<void>;

  /** Todas las categorías, activas o no — para el panel de admin. */
  getAllCategories(): Promise<PingCategoryValue[]>;
  /** Solo las activas — para el picker de "crear anuncio" y el filtro del Home. */
  getActiveCategories(): Promise<PingCategoryValue[]>;
  saveCategory(value: PingCategoryValue): Promise<void>;
  deleteCategory(key: string): Promise<void>;
}

export const SETTINGS_REPOSITORY = Symbol('SETTINGS_REPOSITORY');
