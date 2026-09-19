import { RegisterUserUseCase } from '../../application/use-cases/register-user.use-case';
import { LoginUserUseCase } from '../../application/use-cases/login-user.use-case';
import { LoginWithGoogleUseCase } from '../../application/use-cases/login-with-google.use-case';
import { RegisterDto, LoginDto } from '../../application/dto/auth.dto';
import { GoogleLoginDto } from '../../application/dto/google-login.dto';
export declare class AuthController {
    private readonly registerUser;
    private readonly loginUser;
    private readonly loginWithGoogle;
    constructor(registerUser: RegisterUserUseCase, loginUser: LoginUserUseCase, loginWithGoogle: LoginWithGoogleUseCase);
    register(dto: RegisterDto): Promise<import("../../application/use-cases/register-user.use-case").AuthResult>;
    login(dto: LoginDto): Promise<import("../../application/use-cases/register-user.use-case").AuthResult>;
    loginGoogle(dto: GoogleLoginDto): Promise<import("../../application/use-cases/register-user.use-case").AuthResult>;
}
