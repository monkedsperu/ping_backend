import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { JwtPayload } from './jwt.strategy';
import { USER_REPOSITORY, UserRepositoryPort } from '../../domain/ports/user-repository.port';

/**
 * Se usa DESPUÉS de JwtAuthGuard (que ya deja request.user con el id).
 * Verifica el rol de admin consultando la base en cada request, en vez
 * de confiar solo en el token — así, quitarle el rol a alguien surte
 * efecto de inmediato, sin esperar a que su sesión venza.
 */
@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepositoryPort,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const payload = request.user as JwtPayload | undefined;
    if (!payload?.sub) {
      throw new ForbiddenException('No autorizado.');
    }

    const user = await this.userRepository.findById(payload.sub);
    const canEnter = user && !user.isDisabled && (user.role === 'admin' || user.role === 'mod');
    if (!canEnter) {
      throw new ForbiddenException('No tienes permisos de administrador.');
    }

    return true;
  }
}
