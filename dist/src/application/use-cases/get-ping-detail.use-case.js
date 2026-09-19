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
const ping_view_repository_port_1 = require("../../domain/ports/ping-view-repository.port");
const user_repository_port_1 = require("../../domain/ports/user-repository.port");
let GetPingDetailUseCase = class GetPingDetailUseCase {
    constructor(pingRepository, pingViewRepository, userRepository) {
        this.pingRepository = pingRepository;
        this.pingViewRepository = pingViewRepository;
        this.userRepository = userRepository;
    }
    async execute(pingId, viewerId) {
        const ping = await this.pingRepository.findById(pingId);
        if (!ping) {
            throw new common_1.NotFoundException('El ping no existe.');
        }
        const p = ping.toProps();
        const isOwnPing = viewerId !== null && p.authorId === viewerId;
        if (viewerId !== null && !isOwnPing) {
            await this.pingViewRepository.recordView(pingId, viewerId);
        }
        const [viewCount, author] = await Promise.all([
            this.pingViewRepository.countViews(pingId),
            this.userRepository.findById(p.authorId),
        ]);
        return {
            id: p.id,
            message: p.message,
            imageUrl: p.imageUrl,
            color: p.color,
            authorId: p.authorId,
            authorName: author?.displayName ?? 'Usuario',
            latitude: p.location.latitude,
            longitude: p.location.longitude,
            radiusMeters: p.radiusMeters,
            createdAt: p.createdAt,
            expiresAt: p.expiresAt,
            status: p.status,
            isOwnPing,
            viewCount,
        };
    }
};
exports.GetPingDetailUseCase = GetPingDetailUseCase;
exports.GetPingDetailUseCase = GetPingDetailUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(ping_repository_port_1.PING_REPOSITORY)),
    __param(1, (0, common_1.Inject)(ping_view_repository_port_1.PING_VIEW_REPOSITORY)),
    __param(2, (0, common_1.Inject)(user_repository_port_1.USER_REPOSITORY)),
    __metadata("design:paramtypes", [Object, Object, Object])
], GetPingDetailUseCase);
