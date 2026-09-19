"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const auth_controller_1 = require("./auth.controller");
const register_user_use_case_1 = require("../../application/use-cases/register-user.use-case");
const login_user_use_case_1 = require("../../application/use-cases/login-user.use-case");
const login_with_google_use_case_1 = require("../../application/use-cases/login-with-google.use-case");
const update_display_name_use_case_1 = require("../../application/use-cases/update-display-name.use-case");
const user_repository_port_1 = require("../../domain/ports/user-repository.port");
const prisma_user_repository_1 = require("../persistence/prisma-user.repository");
const jwt_strategy_1 = require("../auth/jwt.strategy");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            passport_1.PassportModule,
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET ?? 'dev-secret-cambiar-en-produccion',
                signOptions: { expiresIn: '30d' },
            }),
        ],
        controllers: [auth_controller_1.AuthController],
        providers: [
            register_user_use_case_1.RegisterUserUseCase,
            login_user_use_case_1.LoginUserUseCase,
            login_with_google_use_case_1.LoginWithGoogleUseCase,
            update_display_name_use_case_1.UpdateDisplayNameUseCase,
            jwt_strategy_1.JwtStrategy,
            { provide: user_repository_port_1.USER_REPOSITORY, useClass: prisma_user_repository_1.PrismaUserRepository },
        ],
    })
], AuthModule);
