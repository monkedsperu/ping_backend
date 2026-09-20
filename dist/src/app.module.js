"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const prisma_module_1 = require("./infrastructure/persistence/prisma.module");
const auth_module_1 = require("./infrastructure/http/auth.module");
const ping_module_1 = require("./infrastructure/http/ping.module");
const uploads_module_1 = require("./infrastructure/http/uploads.module");
const user_module_1 = require("./infrastructure/http/user.module");
const admin_module_1 = require("./infrastructure/http/admin.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, auth_module_1.AuthModule, ping_module_1.PingModule, uploads_module_1.UploadsModule, user_module_1.UserModule, admin_module_1.AdminModule],
    })
], AppModule);
