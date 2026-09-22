import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { User, UserRole } from '../../domain/entities/user.entity';
import { UserRepositoryPort } from '../../domain/ports/user-repository.port';

@Injectable()
export class PrismaUserRepository implements UserRepositoryPort {
  constructor(private readonly prisma: PrismaClient) {}

  async save(user: User): Promise<void> {
    await this.prisma.user.upsert({
      where: { id: user.id },
      create: {
        id: user.id,
        email: user.email,
        passwordHash: user.passwordHash ?? null,
        googleId: user.googleId ?? null,
        displayName: user.displayName,
        role: user.role,
        isDisabled: user.isDisabled,
        visibleCategories: user.visibleCategories,
        createdAt: user.createdAt,
      },
      update: {
        displayName: user.displayName,
        googleId: user.googleId ?? null,
        role: user.role,
        isDisabled: user.isDisabled,
        visibleCategories: user.visibleCategories,
      },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    const row = await this.prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    return row ? this.toDomain(row) : null;
  }

  async findById(id: string): Promise<User | null> {
    const row = await this.prisma.user.findUnique({ where: { id } });
    return row ? this.toDomain(row) : null;
  }

  async findByGoogleId(googleId: string): Promise<User | null> {
    const row = await this.prisma.user.findUnique({ where: { googleId } });
    return row ? this.toDomain(row) : null;
  }

  async findAll(): Promise<User[]> {
    const rows = await this.prisma.user.findMany({ orderBy: { createdAt: 'desc' } });
    return rows.map((row) => this.toDomain(row));
  }

  async upsertGoogleAccount(input: {
    newId: string;
    email: string;
    googleId: string;
    displayName: string;
  }): Promise<User> {
    const row = await this.prisma.user.upsert({
      where: { email: input.email },
      create: {
        id: input.newId,
        email: input.email,
        googleId: input.googleId,
        displayName: input.displayName,
        passwordHash: null,
      },
      update: { googleId: input.googleId },
    });
    return this.toDomain(row);
  }

  private toDomain(row: {
    id: string;
    email: string;
    passwordHash: string | null;
    googleId: string | null;
    displayName: string;
    role: string;
    isDisabled: boolean;
    visibleCategories: string[];
    createdAt: Date;
  }): User {
    return User.reconstitute({
      id: row.id,
      email: row.email,
      passwordHash: row.passwordHash ?? undefined,
      googleId: row.googleId ?? undefined,
      displayName: row.displayName,
      role: row.role as UserRole,
      isDisabled: row.isDisabled,
      visibleCategories: row.visibleCategories,
      createdAt: row.createdAt,
    });
  }
}
