import { CanActivate, ExecutionContext } from '@nestjs/common';
import { UserRepositoryPort } from '../../domain/ports/user-repository.port';
/**
 * Se usa DESPUÉS de JwtAuthGuard (que ya deja request.user con el id).
 * Verifica el rol de admin consultando la base en cada request, en vez
 * de confiar solo en el token — así, quitarle el rol a alguien surte
 * efecto de inmediato, sin esperar a que su sesión venza.
 */
export declare class AdminGuard implements CanActivate {
    private readonly userRepository;
    constructor(userRepository: UserRepositoryPort);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
