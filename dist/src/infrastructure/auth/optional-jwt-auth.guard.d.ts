import { ExecutionContext } from '@nestjs/common';
declare const OptionalJwtAuthGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
/**
 * A diferencia de JwtAuthGuard, este nunca bloquea la petición: si no hay
 * token o es inválido, sigue adelante con request.user = undefined. Se usa
 * en rutas de solo lectura donde queremos permitir navegar sin cuenta,
 * pero aprovechar la identidad si la persona sí inició sesión.
 */
export declare class OptionalJwtAuthGuard extends OptionalJwtAuthGuard_base {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | import("rxjs").Observable<boolean>;
    handleRequest<TUser = unknown>(_err: unknown, user: unknown): TUser;
}
export {};
