import { Body, Controller, Patch, Post, UseGuards } from '@nestjs/common';
import { RegisterUserUseCase } from '../../application/use-cases/register-user.use-case';
import { LoginUserUseCase } from '../../application/use-cases/login-user.use-case';
import { LoginWithGoogleUseCase } from '../../application/use-cases/login-with-google.use-case';
import { UpdateDisplayNameUseCase } from '../../application/use-cases/update-display-name.use-case';
import { RegisterDto, LoginDto } from '../../application/dto/auth.dto';
import { GoogleLoginDto } from '../../application/dto/google-login.dto';
import { UpdateDisplayNameDto } from '../../application/dto/update-display-name.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUserId } from '../auth/current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUser: RegisterUserUseCase,
    private readonly loginUser: LoginUserUseCase,
    private readonly loginWithGoogle: LoginWithGoogleUseCase,
    private readonly updateDisplayName: UpdateDisplayNameUseCase,
  ) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.registerUser.execute(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.loginUser.execute(dto);
  }

  @Post('google')
  loginGoogle(@Body() dto: GoogleLoginDto) {
    return this.loginWithGoogle.execute(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  updateMe(@CurrentUserId() userId: string, @Body() dto: UpdateDisplayNameDto) {
    return this.updateDisplayName.execute(userId, dto);
  }
}
