import { User } from '../entities/user.entity';
export interface UserRepositoryPort {
    save(user: User): Promise<void>;
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    findByGoogleId(googleId: string): Promise<User | null>;
}
export declare const USER_REPOSITORY: unique symbol;
