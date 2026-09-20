"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModule = void 0;
const common_1 = require("@nestjs/common");
const user_controller_1 = require("./user.controller");
const report_location_use_case_1 = require("../../application/use-cases/report-location.use-case");
const user_location_repository_port_1 = require("../../domain/ports/user-location-repository.port");
const user_repository_port_1 = require("../../domain/ports/user-repository.port");
const settings_repository_port_1 = require("../../domain/ports/settings-repository.port");
const prisma_user_location_repository_1 = require("../persistence/prisma-user-location.repository");
const prisma_user_repository_1 = require("../persistence/prisma-user.repository");
const prisma_settings_repository_1 = require("../persistence/prisma-settings.repository");
let UserModule = class UserModule {
};
exports.UserModule = UserModule;
exports.UserModule = UserModule = __decorate([
    (0, common_1.Module)({
        controllers: [user_controller_1.UserController],
        providers: [
            report_location_use_case_1.ReportLocationUseCase,
            { provide: user_location_repository_port_1.USER_LOCATION_REPOSITORY, useClass: prisma_user_location_repository_1.PrismaUserLocationRepository },
            { provide: user_repository_port_1.USER_REPOSITORY, useClass: prisma_user_repository_1.PrismaUserRepository },
            { provide: settings_repository_port_1.SETTINGS_REPOSITORY, useClass: prisma_settings_repository_1.PrismaSettingsRepository },
        ],
    })
], UserModule);
