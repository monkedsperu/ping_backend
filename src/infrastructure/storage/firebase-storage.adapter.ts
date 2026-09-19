import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import * as admin from 'firebase-admin';
import { FileToUpload, StoragePort } from '../../domain/ports/storage.port';

/**
 * Único archivo del proyecto que sabe que las fotos se guardan en Firebase
 * Storage. Sube el archivo, lo marca público, y devuelve la URL. Requiere
 * que admin.initializeApp() haya corrido con las credenciales del proyecto
 * (ver README) y que exista la variable FIREBASE_STORAGE_BUCKET.
 */
@Injectable()
export class FirebaseStorageAdapter implements StoragePort {
  async upload(file: FileToUpload): Promise<string> {
    const bucket = admin.storage().bucket();
    const extension = file.originalName.split('.').pop() ?? 'jpg';
    const destination = `pings/${randomUUID()}.${extension}`;

    const fileRef = bucket.file(destination);
    await fileRef.save(file.buffer, {
      contentType: file.contentType,
      public: true,
    });

    return `https://storage.googleapis.com/${bucket.name}/${destination}`;
  }
}
