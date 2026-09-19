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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const register_user_use_case_1 = require("../../application/use-cases/register-user.use-case");
const login_user_use_case_1 = require("../../application/use-cases/login-user.use-case");
const login_with_google_use_case_1 = require("../../application/use-cases/login-with-google.use-case");
const update_display_name_use_case_1 = require("../../application/use-cases/update-display-name.use-case");
const auth_dto_1 = require("../../application/dto/auth.dto");
const google_login_dto_1 = require("../../application/dto/google-login.dto");
const update_display_name_dto_1 = require("../../application/dto/update-display-name.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const current_user_decorator_1 = require("../auth/current-user.decorator");
let AuthController = class AuthController {
    constructor(registerUser, loginUser, loginWithGoogle, updateDisplayName) {
        this.registerUser = registerUser;
        this.loginUser = loginUser;
        this.loginWithGoogle = loginWithGoogle;
        this.updateDisplayName = updateDisplayName;
    }
    register(dto) {
        return this.registerUser.execute(dto);
    }
    login(dto) {
        return this.loginUser.execute(dto);
    }
    loginGoogle(dto) {
        return this.loginWithGoogle.execute(dto);
    }
    updateMe(userId, dto) {
        return this.updateDisplayName.execute(userId, dto);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.RegisterDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.LoginDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('google'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [google_login_dto_1.GoogleLoginDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "loginGoogle", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Patch)('me'),
    __param(0, (0, current_user_decorator_1.CurrentUserId)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_display_name_dto_1.UpdateDisplayNameDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "updateMe", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [register_user_use_case_1.RegisterUserUseCase,
        login_user_use_case_1.LoginUserUseCase,
        login_with_google_use_case_1.LoginWithGoogleUseCase,
        update_display_name_use_case_1.UpdateDisplayNameUseCase])
], AuthController);
