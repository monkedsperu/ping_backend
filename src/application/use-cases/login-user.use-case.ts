import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { USER_REPOSITORY, UserRepositoryPort } from '../../domain/ports/user-repository.port';
import { LoginDto } from '../dto/auth.dto';
import { AuthResult } from './register-user.use-case';

@Injectable()
export class LoginUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepositoryPort,
    private readonly jwtService: JwtService,
  ) {}

  async execute(dto: LoginDto): Promise<AuthResult> {
    const user = await this.userRepository.findByEmail(dto.email);
    const passwordHash = user?.passwordHash;
    if (!user || !passwordHash) {
      throw new UnauthorizedException(
        user
          ? 'Esta cuenta usa "Continuar con Google" — no tiene contraseña.'
          : 'Correo o contraseña incorrectos.',
      );
    }

    const passwordMatches = await bcrypt.compare(dto.password, passwordHash);
    if (!passwordMatches) {
      throw new UnauthorizedException('Correo o contraseña incorrectos.');
    }

    if (user.isDisabled) {
      throw new UnauthorizedException('Esta cuenta fue deshabilitada. Contacta al soporte.');
    }

    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
      role: user.role,
    });
    return { accessToken, userId: user.id, displayName: user.displayName, role: user.role };
  }
}
