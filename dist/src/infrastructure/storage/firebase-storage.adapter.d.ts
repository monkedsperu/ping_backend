import { FileToUpload, StoragePort } from '../../domain/ports/storage.port';
/**
 * Único archivo del proyecto que sabe que las fotos se guardan en Firebase
 * Storage. Sube el archivo, lo marca público, y devuelve la URL. Requiere
 * que admin.initializeApp() haya corrido con las credenciales del proyecto
 * (ver README) y que exista la variable FIREBASE_STORAGE_BUCKET.
 */
export declare class FirebaseStorageAdapter implements StoragePort {
    upload(file: FileToUpload): Promise<string>;
}
