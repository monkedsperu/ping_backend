"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const fs_1 = require("fs");
const path_1 = require("path");
const admin = __importStar(require("firebase-admin"));
const app_module_1 = require("./app.module");
function initializeFirebase() {
    const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
    const storageBucket = process.env.FIREBASE_STORAGE_BUCKET;
    if (!serviceAccountPath || !(0, fs_1.existsSync)((0, path_1.resolve)(serviceAccountPath))) {
        common_1.Logger.warn(`No se encontró el archivo de credenciales de Firebase (${serviceAccountPath ?? 'no configurado'}). ` +
            'Notificaciones push y subida de fotos no van a funcionar hasta que lo configures (ver README).', 'Bootstrap');
        return;
    }
    admin.initializeApp({
        credential: admin.credential.cert(require((0, path_1.resolve)(serviceAccountPath))),
        storageBucket,
    });
}
async function bootstrap() {
    initializeFirebase();
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors();
    app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true, transform: true }));
    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
