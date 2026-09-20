import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { USER_REPOSITORY, UserRepositoryPort } from '../../domain/ports/user-repository.port';

export interface JwtPayload {
  sub: string; // userId
  email: string;
  role?: string;
}

/**
 * Mensaje reservado: el frontend lo detecta explícitamente para mostrar
 * una pantalla de "cuenta deshabilitada" en vez de un error genérico.
 * No lo cambies sin actualizar también el cliente.
 */
export const ACCOUNT_DISABLED_MESSAGE = 'CUENTA_DESHABILITADA';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepositoryPort,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET ?? 'dev-secret-cambiar-en-produccion',
    });
  }

  /**
   * Se ejecuta en CADA request autenticado, no solo al iniciar sesión —
   * así, si deshabilitas a alguien a mitad de su sesión, deja de poder
   * hacer cualquier cosa de inmediato, sin esperar a que su token venza.
   */
  async validate(payload: JwtPayload): Promise<JwtPayload> {
    const user = await this.userRepository.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('Cuenta no encontrada.');
    }
    if (user.isDisabled) {
      throw new UnauthorizedException(ACCOUNT_DISABLED_MESSAGE);
    }
    return { ...payload, role: user.role };
  }
}
