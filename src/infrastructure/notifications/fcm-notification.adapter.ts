import { Injectable, Logger } from '@nestjs/common';
import * as admin from 'firebase-admin';
import {
  NotificationPort,
  PushNotification,
} from '../../domain/ports/notification.port';

/**
 * Adaptador concreto de FCM. Es el único archivo del proyecto que importa
 * "firebase-admin". Si el día de mañana se cambia a otro proveedor push
 * (OneSignal, APNs directo, etc.), se escribe un adaptador nuevo que
 * implemente NotificationPort y se cambia el binding en ping.module.ts —
 * ningún caso de uso se modifica.
 */
@Injectable()
export class FcmNotificationAdapter implements NotificationPort {
  private readonly logger = new Logger(FcmNotificationAdapter.name);

  async sendBatch(notifications: PushNotification[]): Promise<void> {
    if (notifications.length === 0) return;

    const messages: admin.messaging.Message[] = notifications.map((n) => ({
      token: n.pushToken,
      notification: { title: n.title, body: n.body },
      data: n.data,
    }));

    const response = await admin.messaging().sendEach(messages);

    if (response.failureCount > 0) {
      this.logger.warn(
        `${response.failureCount} notificaciones fallaron de ${notifications.length}.`,
      );
    }
  }
}
