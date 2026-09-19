export interface FileToUpload {
  buffer: Buffer;
  contentType: string;
  originalName: string;
}

/**
 * Puerto de salida para almacenamiento de archivos. La app nunca sube
 * un archivo directamente a Firebase Storage: pasa por esta interfaz,
 * igual que las notificaciones pasan por NotificationPort. Si mañana
 * cambias a S3 o Cloudflare R2, solo se reescribe el adaptador.
 */
export interface StoragePort {
  upload(file: FileToUpload): Promise<string>; // devuelve la URL pública
}

export const STORAGE = Symbol('STORAGE');
