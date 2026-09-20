import { PrismaClient } from '@prisma/client';
import { MessageLimitsValue, SettingsRepositoryPort } from '../../domain/ports/settings-repository.port';
import { RoleLimitsValue } from '../../domain/entities/role-limits.defaults';
import { UserRole } from '../../domain/entities/user.entity';
export declare class PrismaSettingsRepository implements SettingsRepositoryPort {
    private readonly prisma;
    constructor(prisma: PrismaClient);
    getRoleLimits(role: UserRole): Promise<RoleLimitsValue>;
    getAllRoleLimits(): Promise<RoleLimitsValue[]>;
    saveRoleLimits(value: RoleLimitsValue): Promise<void>;
    getMessageLimits(): Promise<MessageLimitsValue>;
    saveMessageLimits(value: MessageLimitsValue): Promise<void>;
}
