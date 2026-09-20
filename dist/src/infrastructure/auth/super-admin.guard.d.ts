import { CanActivate, ExecutionContext } from '@nestjs/common';
import { UserRepositoryPort } from '../../domain/ports/user-repository.port';
/**
 * Más estricto que AdminGuard: solo el rol "admin" exacto pasa por acá
 * (un "mod" ya puede entrar al panel, pero no puede otorgarle roles a
 * nadie — eso queda reservado a los admins de verdad).
 */
export declare class SuperAdminGuard implements CanActivate {
    private readonly userRepository;
    constructor(userRepository: UserRepositoryPort);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
