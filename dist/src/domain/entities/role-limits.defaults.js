"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SOCIAL_PING_RADII = exports.DEFAULT_MESSAGE_LIMITS = exports.DEFAULT_ROLE_LIMITS = void 0;
/**
 * Estos son EXACTAMENTE los valores que estaban fijos en el código antes
 * de este cambio — nadie pierde ninguna opción que ya tenía el día que
 * el admin empiece a configurar esto. Se usan solo cuando no hay fila en
 * la base para ese rol todavía.
 */
exports.DEFAULT_ROLE_LIMITS = {
    user: {
        role: 'user',
        allowedPingRadii: [50, 100, 200, 300, 400, 500],
        allowedListeningRadii: [100, 200, 500, 1000, 2000],
        allowedDurations: [5, 15, 30, 60, 360, 1440],
    },
    premium: {
        role: 'premium',
        allowedPingRadii: [50, 100, 200, 300, 400, 500, 700, 1000],
        allowedListeningRadii: [100, 200, 500, 1000, 2000, 5000, 10000],
        allowedDurations: [5, 15, 30, 60, 360, 1440],
    },
    mod: {
        role: 'mod',
        allowedPingRadii: [50, 100, 200, 300, 400, 500, 700, 1000],
        allowedListeningRadii: [100, 200, 500, 1000, 2000, 5000, 10000],
        allowedDurations: [5, 15, 30, 60, 360, 1440],
    },
    admin: {
        role: 'admin',
        allowedPingRadii: [50, 100, 200, 300, 400, 500, 700, 1000],
        allowedListeningRadii: [100, 200, 500, 1000, 2000, 5000, 10000],
        allowedDurations: [5, 15, 30, 60, 360, 1440],
    },
};
exports.DEFAULT_MESSAGE_LIMITS = {
    minMessageLength: 5,
    maxMessageLength: 280,
};
/** Un anuncio "social" (persona/mascota perdida) siempre puede usar el
 * rango extendido, sin importar el rol del autor — esto NO se configura
 * desde el panel, es una regla fija de producto. */
exports.SOCIAL_PING_RADII = [50, 100, 200, 300, 400, 500, 700, 1000];
