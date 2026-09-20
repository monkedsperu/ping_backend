import { PrismaClient } from '@prisma/client';
import { User } from '../../domain/entities/user.entity';
import { UserRepositoryPort } from '../../domain/ports/user-repository.port';
export declare class PrismaUserRepository implements UserRepositoryPort {
    private readonly prisma;
    constructor(prisma: PrismaClient);
    save(user: User): Promise<void>;
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    findByGoogleId(googleId: string): Promise<User | null>;
    findAll(): Promise<User[]>;
    upsertGoogleAccount(input: {
        newId: string;
        email: string;
        googleId: string;
        displayName: string;
    }): Promise<User>;
    private toDomain;
}
