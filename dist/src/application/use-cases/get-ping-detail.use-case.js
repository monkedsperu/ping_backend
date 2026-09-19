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
exports.GetPingDetailUseCase = void 0;
const common_1 = require("@nestjs/common");
const ping_repository_port_1 = require("../../domain/ports/ping-repository.port");
/**
 * viewerId puede ser null (alguien navegando sin sesión). En ese caso
 * isOwnPing siempre es false — nadie sin cuenta puede ser autor de nada.
 */
let GetPingDetailUseCase = class GetPingDetailUseCase {
    constructor(pingRepository) {
        this.pingRepository = pingRepository;
    }
    async execute(pingId, viewerId) {
        const ping = await this.pingRepository.findById(pingId);
        if (!ping) {
            throw new common_1.NotFoundException('El ping no existe.');
        }
        const p = ping.toProps();
        return {
            id: p.id,
            message: p.message,
            imageUrl: p.imageUrl,
            color: p.color,
            authorId: p.authorId,
            latitude: p.location.latitude,
            longitude: p.location.longitude,
            radiusMeters: p.radiusMeters,
            createdAt: p.createdAt,
            expiresAt: p.expiresAt,
            status: p.status,
            isOwnPing: viewerId !== null && p.authorId === viewerId,
        };
    }
};
exports.GetPingDetailUseCase = GetPingDetailUseCase;
exports.GetPingDetailUseCase = GetPingDetailUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(ping_repository_port_1.PING_REPOSITORY)),
    __metadata("design:paramtypes", [Object])
], GetPingDetailUseCase);
