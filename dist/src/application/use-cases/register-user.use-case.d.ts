import { JwtService } from '@nestjs/jwt';
import { UserRepositoryPort } from '../../domain/ports/user-repository.port';
import { RegisterDto } from '../dto/auth.dto';
export interface AuthResult {
    accessToken: string;
    userId: string;
    displayName: string;
    role: string;
}
export declare class RegisterUserUseCase {
    private readonly userRepository;
    private readonly jwtService;
    constructor(userRepository: UserRepositoryPort, jwtService: JwtService);
    execute(dto: RegisterDto): Promise<AuthResult>;
}
