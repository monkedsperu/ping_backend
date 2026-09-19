import { RegisterUserUseCase } from '../../application/use-cases/register-user.use-case';
import { LoginUserUseCase } from '../../application/use-cases/login-user.use-case';
import { LoginWithGoogleUseCase } from '../../application/use-cases/login-with-google.use-case';
import { UpdateDisplayNameUseCase } from '../../application/use-cases/update-display-name.use-case';
import { RegisterDto, LoginDto } from '../../application/dto/auth.dto';
import { GoogleLoginDto } from '../../application/dto/google-login.dto';
import { UpdateDisplayNameDto } from '../../application/dto/update-display-name.dto';
export declare class AuthController {
    private readonly registerUser;
    private readonly loginUser;
    private readonly loginWithGoogle;
    private readonly updateDisplayName;
    constructor(registerUser: RegisterUserUseCase, loginUser: LoginUserUseCase, loginWithGoogle: LoginWithGoogleUseCase, updateDisplayName: UpdateDisplayNameUseCase);
    register(dto: RegisterDto): Promise<import("../../application/use-cases/register-user.use-case").AuthResult>;
    login(dto: LoginDto): Promise<import("../../application/use-cases/register-user.use-case").AuthResult>;
    loginGoogle(dto: GoogleLoginDto): Promise<import("../../application/use-cases/register-user.use-case").AuthResult>;
    updateMe(userId: string, dto: UpdateDisplayNameDto): Promise<{
        displayName: string;
    }>;
}
