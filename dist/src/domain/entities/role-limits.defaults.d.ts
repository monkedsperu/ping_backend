import { UserRole } from '../entities/user.entity';
export interface RoleLimitsValue {
    role: UserRole;
    allowedPingRadii: number[];
    allowedListeningRadii: number[];
    allowedDurations: number[];
}
/**
 * Estos son EXACTAMENTE los valores que estaban fijos en el código antes
 * de este cambio — nadie pierde ninguna opción que ya tenía el día que
 * el admin empiece a configurar esto. Se usan solo cuando no hay fila en
 * la base para ese rol todavía.
 */
export declare const DEFAULT_ROLE_LIMITS: Record<UserRole, RoleLimitsValue>;
export declare const DEFAULT_MESSAGE_LIMITS: {
    minMessageLength: number;
    maxMessageLength: number;
};
/** Un anuncio "social" (persona/mascota perdida) siempre puede usar el
 * rango extendido, sin importar el rol del autor — esto NO se configura
 * desde el panel, es una regla fija de producto. */
export declare const SOCIAL_PING_RADII: number[];
