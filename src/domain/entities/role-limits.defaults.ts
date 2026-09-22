import { UserRole } from '../entities/user.entity';

export interface RoleLimitsValue {
  role: UserRole;
  allowedPingRadii: number[];
  allowedListeningRadii: number[];
  allowedDurations: number[];
  /** Placeholder — hoy no limita nada de verdad, es solo un valor que se
   * muestra deshabilitado en el formulario. Queda listo para cuando se
   * quiera hacer cumplir de verdad. */
  maxListenersPerPing: number;
}

/**
 * Estos son EXACTAMENTE los valores que estaban fijos en el código antes
 * de este cambio — nadie pierde ninguna opción que ya tenía el día que
 * el admin empiece a configurar esto. Se usan solo cuando no hay fila en
 * la base para ese rol todavía.
 */
export const DEFAULT_ROLE_LIMITS: Record<UserRole, RoleLimitsValue> = {
  user: {
    role: 'user',
    allowedPingRadii: [50, 100, 200, 300, 400, 500],
    allowedListeningRadii: [100, 200, 500, 1000, 2000],
    allowedDurations: [5, 15, 30, 60, 360, 1440],
    maxListenersPerPing: 50,
  },
  premium: {
    role: 'premium',
    allowedPingRadii: [50, 100, 200, 300, 400, 500, 700, 1000],
    allowedListeningRadii: [100, 200, 500, 1000, 2000, 5000, 10000],
    allowedDurations: [5, 15, 30, 60, 360, 1440],
    maxListenersPerPing: 200,
  },
  mod: {
    role: 'mod',
    allowedPingRadii: [50, 100, 200, 300, 400, 500, 700, 1000],
    allowedListeningRadii: [100, 200, 500, 1000, 2000, 5000, 10000],
    allowedDurations: [5, 15, 30, 60, 360, 1440],
    maxListenersPerPing: 200,
  },
  admin: {
    role: 'admin',
    allowedPingRadii: [50, 100, 200, 300, 400, 500, 700, 1000],
    allowedListeningRadii: [100, 200, 500, 1000, 2000, 5000, 10000],
    allowedDurations: [5, 15, 30, 60, 360, 1440],
    maxListenersPerPing: 200,
  },
};

export const DEFAULT_MESSAGE_LIMITS = {
  minMessageLength: 5,
  maxMessageLength: 280,
};

/** Un anuncio "social" (persona/mascota perdida) siempre puede usar el
 * rango extendido, sin importar el rol del autor — esto NO se configura
 * desde el panel, es una regla fija de producto. */
export const SOCIAL_PING_RADII = [50, 100, 200, 300, 400, 500, 700, 1000];
/** Mismo criterio que el radio: hasta 30 días para anuncios sociales. */
export const SOCIAL_DURATIONS = [5, 15, 30, 60, 360, 1440, 4320, 10080, 43200];
/** Placeholder, igual que maxListenersPerPing en RoleLimits — hoy no
 * limita nada de verdad. */
export const SOCIAL_MAX_LISTENERS = 200;

export interface DefaultPingCategory {
  key: string;
  label: string;
  icon: string;
  isActive: boolean;
  sortOrder: number;
}

/** Igual que con los roles: estos son solo el punto de partida si el
 * admin nunca tocó nada en el panel — ahí puede agregar, renombrar o
 * desactivar categorías libremente. */
export const DEFAULT_PING_CATEGORIES: DefaultPingCategory[] = [
  { key: 'general', label: 'General', icon: 'megaphone-outline', isActive: true, sortOrder: 0 },
  { key: 'venta', label: 'Venta', icon: 'pricetag-outline', isActive: true, sortOrder: 1 },
  { key: 'compra', label: 'Compra', icon: 'cart-outline', isActive: true, sortOrder: 2 },
  { key: 'ayuda', label: 'Ayuda / emergencia', icon: 'medkit-outline', isActive: true, sortOrder: 3 },
  { key: 'info', label: 'Información', icon: 'newspaper-outline', isActive: true, sortOrder: 4 },
  { key: 'evento', label: 'Evento', icon: 'calendar-outline', isActive: true, sortOrder: 5 },
];
