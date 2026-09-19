import { JwtService } from '@nestjs/jwt';
import { UserRepositoryPort } from '../../domain/ports/user-repository.port';
import { GoogleLoginDto } from '../dto/google-login.dto';
import { AuthResult } from './register-user.use-case';
export declare class LoginWithGoogleUseCase {
    private readonly userRepository;
    private readonly jwtService;
    private readonly client;
    constructor(userRepository: UserRepositoryPort, jwtService: JwtService);
    execute(dto: GoogleLoginDto): Promise<AuthResult>;
}
