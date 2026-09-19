export interface PushNotification {
  pushToken: string;
  title: string;
  body: string;
  data?: Record<string, string>;
}

/**
 * Puerto de salida para notificaciones push. Hoy lo implementa un adaptador
 * de Firebase Cloud Messaging; cambiar de proveedor no debería tocar
 * ni una línea de application/ ni de domain/.
 */
export interface NotificationPort {
  sendBatch(notifications: PushNotification[]): Promise<void>;
}

export const NOTIFICATION_SENDER = Symbol('NOTIFICATION_SENDER');
