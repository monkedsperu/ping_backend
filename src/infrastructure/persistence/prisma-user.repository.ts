import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { User } from '../../domain/entities/user.entity';
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
        createdAt: user.createdAt,
      },
      update: {
        displayName: user.displayName,
        googleId: user.googleId ?? null,
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

  private toDomain(row: {
    id: string;
    email: string;
    passwordHash: string | null;
    googleId: string | null;
    displayName: string;
    createdAt: Date;
  }): User {
    return User.reconstitute({
      id: row.id,
      email: row.email,
      passwordHash: row.passwordHash ?? undefined,
      googleId: row.googleId ?? undefined,
      displayName: row.displayName,
      createdAt: row.createdAt,
    });
  }
}
