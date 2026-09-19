import { JwtService } from '@nestjs/jwt';
import { UserRepositoryPort } from '../../domain/ports/user-repository.port';
import { LoginDto } from '../dto/auth.dto';
import { AuthResult } from './register-user.use-case';
export declare class LoginUserUseCase {
    private readonly userRepository;
    private readonly jwtService;
    constructor(userRepository: UserRepositoryPort, jwtService: JwtService);
    execute(dto: LoginDto): Promise<AuthResult>;
}
