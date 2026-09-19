import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { existsSync } from 'fs';
import { resolve } from 'path';
import * as admin from 'firebase-admin';
import { AppModule } from './app.module';

function initializeFirebase() {
  const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
  const storageBucket = process.env.FIREBASE_STORAGE_BUCKET;

  if (!serviceAccountPath || !existsSync(resolve(serviceAccountPath))) {
    Logger.warn(
      `No se encontró el archivo de credenciales de Firebase (${serviceAccountPath ?? 'no configurado'}). ` +
        'Notificaciones push y subida de fotos no van a funcionar hasta que lo configures (ver README).',
      'Bootstrap',
    );
    return;
  }

  admin.initializeApp({
    credential: admin.credential.cert(require(resolve(serviceAccountPath))),
    storageBucket,
  });
}

async function bootstrap() {
  initializeFirebase();
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
