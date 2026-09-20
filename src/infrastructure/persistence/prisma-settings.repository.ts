import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import {
  MessageLimitsValue,
  SettingsRepositoryPort,
} from '../../domain/ports/settings-repository.port';
import {
  DEFAULT_MESSAGE_LIMITS,
  DEFAULT_ROLE_LIMITS,
  RoleLimitsValue,
} from '../../domain/entities/role-limits.defaults';
import { UserRole } from '../../domain/entities/user.entity';

@Injectable()
export class PrismaSettingsRepository implements SettingsRepositoryPort {
  constructor(private readonly prisma: PrismaClient) {}

  async getRoleLimits(role: UserRole): Promise<RoleLimitsValue> {
    const row = await this.prisma.roleLimits.findUnique({ where: { role } });
    if (!row) return DEFAULT_ROLE_LIMITS[role];
    return {
      role,
      allowedPingRadii: row.allowedPingRadii,
      allowedListeningRadii: row.allowedListeningRadii,
      allowedDurations: row.allowedDurations,
    };
  }

  async getAllRoleLimits(): Promise<RoleLimitsValue[]> {
    const roles: UserRole[] = ['user', 'premium', 'mod', 'admin'];
    return Promise.all(roles.map((role) => this.getRoleLimits(role)));
  }

  async saveRoleLimits(value: RoleLimitsValue): Promise<void> {
    await this.prisma.roleLimits.upsert({
      where: { role: value.role },
      create: {
        role: value.role,
        allowedPingRadii: value.allowedPingRadii,
        allowedListeningRadii: value.allowedListeningRadii,
        allowedDurations: value.allowedDurations,
      },
      update: {
        allowedPingRadii: value.allowedPingRadii,
        allowedListeningRadii: value.allowedListeningRadii,
        allowedDurations: value.allowedDurations,
      },
    });
  }

  async getMessageLimits(): Promise<MessageLimitsValue> {
    const row = await this.prisma.platformSettings.findUnique({ where: { id: 'default' } });
    if (!row) return DEFAULT_MESSAGE_LIMITS;
    return { minMessageLength: row.minMessageLength, maxMessageLength: row.maxMessageLength };
  }

  async saveMessageLimits(value: MessageLimitsValue): Promise<void> {
    await this.prisma.platformSettings.upsert({
      where: { id: 'default' },
      create: { id: 'default', ...value },
      update: value,
    });
  }
}
