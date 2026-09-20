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
exports.LoginWithGoogleUseCase = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const google_auth_library_1 = require("google-auth-library");
const crypto_1 = require("crypto");
const user_repository_port_1 = require("../../domain/ports/user-repository.port");
/**
 * Los 3 client IDs (web/iOS/Android) son "audiencias" válidas — Google
 * firma el token distinto según desde qué plataforma se pidió, así que
 * hay que aceptar cualquiera de los que configuraste en Cloud Console.
 * Ver .env.example y el README para cómo conseguirlos.
 */
function getAllowedAudiences() {
    return [
        process.env.GOOGLE_CLIENT_ID_WEB,
        process.env.GOOGLE_CLIENT_ID_IOS,
        process.env.GOOGLE_CLIENT_ID_ANDROID,
    ].filter((id) => Boolean(id));
}
let LoginWithGoogleUseCase = class LoginWithGoogleUseCase {
    constructor(userRepository, jwtService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.client = new google_auth_library_1.OAuth2Client();
    }
    async execute(dto) {
        const audiences = getAllowedAudiences();
        if (audiences.length === 0) {
            throw new common_1.UnauthorizedException('Login con Google no está configurado en el servidor (faltan las client IDs).');
        }
        let payload;
        try {
            const ticket = await this.client.verifyIdToken({ idToken: dto.idToken, audience: audiences });
            payload = ticket.getPayload();
        }
        catch {
            throw new common_1.UnauthorizedException('Token de Google inválido o vencido.');
        }
        if (!payload?.sub || !payload.email) {
            throw new common_1.UnauthorizedException('Google no devolvió los datos esperados.');
        }
        const googleId = payload.sub;
        const email = payload.email;
        const displayName = payload.name ?? email.split('@')[0];
        let user = await this.userRepository.findByGoogleId(googleId);
        if (!user) {
            user = await this.userRepository.upsertGoogleAccount({
                newId: (0, crypto_1.randomUUID)(),
                email,
                googleId,
                displayName,
            });
        }
        if (user.isDisabled) {
            throw new common_1.UnauthorizedException('Esta cuenta fue deshabilitada. Contacta al soporte.');
        }
        const accessToken = await this.jwtService.signAsync({
            sub: user.id,
            email: user.email,
            role: user.role,
        });
        return { accessToken, userId: user.id, displayName: user.displayName, role: user.role };
    }
};
exports.LoginWithGoogleUseCase = LoginWithGoogleUseCase;
exports.LoginWithGoogleUseCase = LoginWithGoogleUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(user_repository_port_1.USER_REPOSITORY)),
    __metadata("design:paramtypes", [Object, jwt_1.JwtService])
], LoginWithGoogleUseCase);
