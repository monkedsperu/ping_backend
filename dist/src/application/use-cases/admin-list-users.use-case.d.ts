import { UserRepositoryPort } from '../../domain/ports/user-repository.port';
export interface AdminUserView {
    id: string;
    email: string;
    displayName: string;
    role: string;
    isDisabled: boolean;
    hasGoogle: boolean;
    createdAt: Date;
}
export declare class AdminListUsersUseCase {
    private readonly userRepository;
    constructor(userRepository: UserRepositoryPort);
    execute(): Promise<AdminUserView[]>;
}
