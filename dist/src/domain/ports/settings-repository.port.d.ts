import { RoleLimitsValue } from '../entities/role-limits.defaults';
import { UserRole } from '../entities/user.entity';
export interface MessageLimitsValue {
    minMessageLength: number;
    maxMessageLength: number;
}
export interface SettingsRepositoryPort {
    getRoleLimits(role: UserRole): Promise<RoleLimitsValue>;
    getAllRoleLimits(): Promise<RoleLimitsValue[]>;
    saveRoleLimits(value: RoleLimitsValue): Promise<void>;
    getMessageLimits(): Promise<MessageLimitsValue>;
    saveMessageLimits(value: MessageLimitsValue): Promise<void>;
}
export declare const SETTINGS_REPOSITORY: unique symbol;
