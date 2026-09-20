import { Strategy } from 'passport-jwt';
import { UserRepositoryPort } from '../../domain/ports/user-repository.port';
export interface JwtPayload {
    sub: string;
    email: string;
    role?: string;
}
/**
 * Mensaje reservado: el frontend lo detecta explícitamente para mostrar
 * una pantalla de "cuenta deshabilitada" en vez de un error genérico.
 * No lo cambies sin actualizar también el cliente.
 */
export declare const ACCOUNT_DISABLED_MESSAGE = "CUENTA_DESHABILITADA";
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly userRepository;
    constructor(userRepository: UserRepositoryPort);
    /**
     * Se ejecuta en CADA request autenticado, no solo al iniciar sesión —
     * así, si deshabilitas a alguien a mitad de su sesión, deja de poder
     * hacer cualquier cosa de inmediato, sin esperar a que su token venza.
     */
    validate(payload: JwtPayload): Promise<JwtPayload>;
}
export {};
