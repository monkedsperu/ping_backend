import { UserRepositoryPort } from '../../domain/ports/user-repository.port';
export declare class AdminSetUserDisabledUseCase {
    private readonly userRepository;
    constructor(userRepository: UserRepositoryPort);
    execute(userId: string, disabled: boolean): Promise<void>;
}
