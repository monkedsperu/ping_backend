import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload } from './jwt.strategy';

/**
 * Uso: create(@CurrentUserId() userId: string, ...). Evita que cada
 * controlador tenga que saber que el id vive en request.user.sub.
 */
export const CurrentUserId = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as JwtPayload;
    return user.sub;
  },
);

/**
 * Igual que CurrentUserId, pero para rutas con OptionalJwtAuthGuard donde
 * puede no haber ningún usuario autenticado (navegación sin cuenta).
 */
export const CurrentUserIdOptional = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string | null => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as JwtPayload | undefined;
    return user?.sub ?? null;
  },
);
