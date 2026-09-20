import { UserRepositoryPort } from '../../domain/ports/user-repository.port';
import { UserRole } from '../../domain/entities/user.entity';
export declare class AdminSetUserRoleUseCase {
    private readonly userRepository;
    constructor(userRepository: UserRepositoryPort);
    execute(userId: string, role: UserRole): Promise<void>;
}
