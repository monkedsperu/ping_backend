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
 * Más estricto que AdminGuard: solo el rol "admin" exacto pasa por acá
 * (un "mod" ya puede entrar al panel, pero no puede otorgarle roles a
 * nadie — eso queda reservado a los admins de verdad).
 */
@Injectable()
export class SuperAdminGuard implements CanActivate {
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
    if (!user || user.isDisabled || user.role !== 'admin') {
      throw new ForbiddenException('Solo un administrador puede hacer esto.');
    }

    return true;
  }
}
