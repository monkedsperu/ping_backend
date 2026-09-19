import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { OAuth2Client } from 'google-auth-library';
import { randomUUID } from 'crypto';
import { USER_REPOSITORY, UserRepositoryPort } from '../../domain/ports/user-repository.port';
import { GoogleLoginDto } from '../dto/google-login.dto';
import { AuthResult } from './register-user.use-case';

/**
 * Los 3 client IDs (web/iOS/Android) son "audiencias" válidas — Google
 * firma el token distinto según desde qué plataforma se pidió, así que
 * hay que aceptar cualquiera de los que configuraste en Cloud Console.
 * Ver .env.example y el README para cómo conseguirlos.
 */
function getAllowedAudiences(): string[] {
  return [
    process.env.GOOGLE_CLIENT_ID_WEB,
    process.env.GOOGLE_CLIENT_ID_IOS,
    process.env.GOOGLE_CLIENT_ID_ANDROID,
  ].filter((id): id is string => Boolean(id));
}

@Injectable()
export class LoginWithGoogleUseCase {
  private readonly client = new OAuth2Client();

  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepositoryPort,
    private readonly jwtService: JwtService,
  ) {}

  async execute(dto: GoogleLoginDto): Promise<AuthResult> {
    const audiences = getAllowedAudiences();
    if (audiences.length === 0) {
      throw new UnauthorizedException(
        'Login con Google no está configurado en el servidor (faltan las client IDs).',
      );
    }

    let payload;
    try {
      const ticket = await this.client.verifyIdToken({ idToken: dto.idToken, audience: audiences });
      payload = ticket.getPayload();
    } catch {
      throw new UnauthorizedException('Token de Google inválido o vencido.');
    }

    if (!payload?.sub || !payload.email) {
      throw new UnauthorizedException('Google no devolvió los datos esperados.');
    }

    const googleId = payload.sub;
    const email = payload.email;
    const displayName = payload.name ?? email.split('@')[0];

    let user = await this.userRepository.findByGoogleId(googleId);
    if (!user) {
      user = await this.userRepository.upsertGoogleAccount({
        newId: randomUUID(),
        email,
        googleId,
        displayName,
      });
    }

    const accessToken = await this.jwtService.signAsync({ sub: user.id, email: user.email });
    return { accessToken, userId: user.id, displayName: user.displayName };
  }
}
