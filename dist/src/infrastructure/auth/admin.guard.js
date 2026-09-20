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
exports.AdminGuard = void 0;
const common_1 = require("@nestjs/common");
const user_repository_port_1 = require("../../domain/ports/user-repository.port");
/**
 * Se usa DESPUÉS de JwtAuthGuard (que ya deja request.user con el id).
 * Verifica el rol de admin consultando la base en cada request, en vez
 * de confiar solo en el token — así, quitarle el rol a alguien surte
 * efecto de inmediato, sin esperar a que su sesión venza.
 */
let AdminGuard = class AdminGuard {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const payload = request.user;
        if (!payload?.sub) {
            throw new common_1.ForbiddenException('No autorizado.');
        }
        const user = await this.userRepository.findById(payload.sub);
        const canEnter = user && !user.isDisabled && (user.role === 'admin' || user.role === 'mod');
        if (!canEnter) {
            throw new common_1.ForbiddenException('No tienes permisos de administrador.');
        }
        return true;
    }
};
exports.AdminGuard = AdminGuard;
exports.AdminGuard = AdminGuard = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(user_repository_port_1.USER_REPOSITORY)),
    __metadata("design:paramtypes", [Object])
], AdminGuard);
