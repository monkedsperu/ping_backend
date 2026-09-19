"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadPhotoUseCase = void 0;
const common_1 = require("@nestjs/common");
const storage_port_1 = require("../../domain/ports/storage.port");
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB, suficiente para fotos de celular comprimidas
let UploadPhotoUseCase = class UploadPhotoUseCase {
    constructor(storage) {
        this.storage = storage;
    }
    async execute(file) {
        if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
            throw new common_1.BadRequestException('Solo se permiten imágenes jpeg, png o webp.');
        }
        if (file.size > MAX_SIZE_BYTES) {
            throw new common_1.BadRequestException('La imagen no puede superar los 5 MB.');
        }
        const url = await this.storage.upload({
            buffer: file.buffer,
            contentType: file.mimetype,
            originalName: file.originalname,
        });
        return { url };
    }
};
exports.UploadPhotoUseCase = UploadPhotoUseCase;
exports.UploadPhotoUseCase = UploadPhotoUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(storage_port_1.STORAGE)),
    __metadata("design:paramtypes", [Object])
], UploadPhotoUseCase);
