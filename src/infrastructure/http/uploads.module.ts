import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadPhotoUseCase } from '../../application/use-cases/upload-photo.use-case';
import { STORAGE } from '../../domain/ports/storage.port';
import { FirebaseStorageAdapter } from '../storage/firebase-storage.adapter';

@Module({
  controllers: [UploadController],
  providers: [
    UploadPhotoUseCase,
    { provide: STORAGE, useClass: FirebaseStorageAdapter },
  ],
})
export class UploadsModule {}
