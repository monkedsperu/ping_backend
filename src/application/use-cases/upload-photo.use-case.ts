import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { STORAGE, StoragePort } from '../../domain/ports/storage.port';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB, suficiente para fotos de celular comprimidas

@Injectable()
export class UploadPhotoUseCase {
  constructor(@Inject(STORAGE) private readonly storage: StoragePort) {}

  async execute(file: {
    buffer: Buffer;
    mimetype: string;
    originalname: string;
    size: number;
  }): Promise<{ url: string }> {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      throw new BadRequestException('Solo se permiten imágenes jpeg, png o webp.');
    }
    if (file.size > MAX_SIZE_BYTES) {
      throw new BadRequestException('La imagen no puede superar los 5 MB.');
    }

    const url = await this.storage.upload({
      buffer: file.buffer,
      contentType: file.mimetype,
      originalName: file.originalname,
    });

    return { url };
  }
}
