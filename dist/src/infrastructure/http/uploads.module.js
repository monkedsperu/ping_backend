"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadsModule = void 0;
const common_1 = require("@nestjs/common");
const upload_controller_1 = require("./upload.controller");
const upload_photo_use_case_1 = require("../../application/use-cases/upload-photo.use-case");
const storage_port_1 = require("../../domain/ports/storage.port");
const firebase_storage_adapter_1 = require("../storage/firebase-storage.adapter");
let UploadsModule = class UploadsModule {
};
exports.UploadsModule = UploadsModule;
exports.UploadsModule = UploadsModule = __decorate([
    (0, common_1.Module)({
        controllers: [upload_controller_1.UploadController],
        providers: [
            upload_photo_use_case_1.UploadPhotoUseCase,
            { provide: storage_port_1.STORAGE, useClass: firebase_storage_adapter_1.FirebaseStorageAdapter },
        ],
    })
], UploadsModule);
