import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadPhotoUseCase } from '../../application/use-cases/upload-photo.use-case';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('uploads')
export class UploadController {
  constructor(private readonly uploadPhoto: UploadPhotoUseCase) {}

  @Post('photo')
  @UseInterceptors(FileInterceptor('photo'))
  async uploadPhotoFile(@UploadedFile() file?: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Falta el archivo en el campo "photo".');
    }
    return this.uploadPhoto.execute(file);
  }
}
