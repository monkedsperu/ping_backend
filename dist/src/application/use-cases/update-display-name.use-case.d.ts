import { UserRepositoryPort } from '../../domain/ports/user-repository.port';
import { UpdateDisplayNameDto } from '../dto/update-display-name.dto';
export declare class UpdateDisplayNameUseCase {
    private readonly userRepository;
    constructor(userRepository: UserRepositoryPort);
    execute(userId: string, dto: UpdateDisplayNameDto): Promise<{
        displayName: string;
    }>;
}
