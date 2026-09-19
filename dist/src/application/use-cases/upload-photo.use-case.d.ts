import { StoragePort } from '../../domain/ports/storage.port';
export declare class UploadPhotoUseCase {
    private readonly storage;
    constructor(storage: StoragePort);
    execute(file: {
        buffer: Buffer;
        mimetype: string;
        originalname: string;
        size: number;
    }): Promise<{
        url: string;
    }>;
}
