import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import {
  MessageLimitsValue,
  PingCategoryValue,
  SettingsRepositoryPort,
} from '../../domain/ports/settings-repository.port';
import {
  DEFAULT_MESSAGE_LIMITS,
  DEFAULT_PING_CATEGORIES,
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
      maxListenersPerPing: row.maxListenersPerPing,
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
        maxListenersPerPing: value.maxListenersPerPing,
      },
      update: {
        allowedPingRadii: value.allowedPingRadii,
        allowedListeningRadii: value.allowedListeningRadii,
        allowedDurations: value.allowedDurations,
        maxListenersPerPing: value.maxListenersPerPing,
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

  async getAllCategories(): Promise<PingCategoryValue[]> {
    const rows = await this.prisma.pingCategory.findMany({ orderBy: { sortOrder: 'asc' } });
    if (rows.length === 0) {
      // Nadie configuró nada todavía — devolvemos los defaults tal cual,
      // sin escribirlos en la base (se escriben recién cuando el admin
      // guarda algo por primera vez, vía saveCategory).
      return DEFAULT_PING_CATEGORIES.map((c) => ({ ...c }));
    }
    return rows.map((row) => ({
      key: row.key,
      label: row.label,
      icon: row.icon ?? undefined,
      isActive: row.isActive,
      sortOrder: row.sortOrder,
    }));
  }

  async getActiveCategories(): Promise<PingCategoryValue[]> {
    const all = await this.getAllCategories();
    return all.filter((c) => c.isActive);
  }

  async saveCategory(value: PingCategoryValue): Promise<void> {
    // Si la tabla está vacía, primero sembramos los defaults — si no,
    // guardar UNA categoría nueva haría que las demás (que solo existían
    // como default en memoria) desaparezcan de golpe.
    const count = await this.prisma.pingCategory.count();
    if (count === 0) {
      await this.prisma.pingCategory.createMany({
        data: DEFAULT_PING_CATEGORIES.filter((c) => c.key !== value.key),
        skipDuplicates: true,
      });
    }

    await this.prisma.pingCategory.upsert({
      where: { key: value.key },
      create: {
        key: value.key,
        label: value.label,
        icon: value.icon ?? null,
        isActive: value.isActive,
        sortOrder: value.sortOrder,
      },
      update: {
        label: value.label,
        icon: value.icon ?? null,
        isActive: value.isActive,
        sortOrder: value.sortOrder,
      },
    });
  }

  async deleteCategory(key: string): Promise<void> {
    // Igual que en saveCategory: si nunca se sembró la tabla, sembramos
    // antes de borrar, para no terminar borrando "de la nada" y dejar
    // la tabla con solo 1 fila en vez de los defaults menos esa.
    const count = await this.prisma.pingCategory.count();
    if (count === 0) {
      await this.prisma.pingCategory.createMany({
        data: DEFAULT_PING_CATEGORIES,
        skipDuplicates: true,
      });
    }
    await this.prisma.pingCategory.delete({ where: { key } }).catch(() => {
      // ya no existía — no es un error real para quien llama a esto.
    });
  }
}
