import { NotificationPort, PushNotification } from '../../domain/ports/notification.port';
/**
 * Adaptador concreto de FCM. Es el único archivo del proyecto que importa
 * "firebase-admin". Si el día de mañana se cambia a otro proveedor push
 * (OneSignal, APNs directo, etc.), se escribe un adaptador nuevo que
 * implemente NotificationPort y se cambia el binding en ping.module.ts —
 * ningún caso de uso se modifica.
 */
export declare class FcmNotificationAdapter implements NotificationPort {
    private readonly logger;
    sendBatch(notifications: PushNotification[]): Promise<void>;
}
