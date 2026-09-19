import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * A diferencia de JwtAuthGuard, este nunca bloquea la petición: si no hay
 * token o es inválido, sigue adelante con request.user = undefined. Se usa
 * en rutas de solo lectura donde queremos permitir navegar sin cuenta,
 * pero aprovechar la identidad si la persona sí inició sesión.
 */
@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest<TUser = unknown>(_err: unknown, user: unknown): TUser {
    return (user || undefined) as TUser;
  }
}
