import { UploadPhotoUseCase } from '../../application/use-cases/upload-photo.use-case';
export declare class UploadController {
    private readonly uploadPhoto;
    constructor(uploadPhoto: UploadPhotoUseCase);
    uploadPhotoFile(file?: Express.Multer.File): Promise<{
        url: string;
    }>;
}
