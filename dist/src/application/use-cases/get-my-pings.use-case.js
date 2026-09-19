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
exports.GetMyPingsUseCase = void 0;
const common_1 = require("@nestjs/common");
const ping_repository_port_1 = require("../../domain/ports/ping-repository.port");
const ping_thread_repository_port_1 = require("../../domain/ports/ping-thread-repository.port");
/**
 * "Mis pings": tus conversaciones no deberían desaparecer solo porque tu
 * círculo de escucha ya no cubre un ping que pusiste en otro lado del
 * mapa. Esta lista es independiente de esa ubicación/radio actual.
 */
let GetMyPingsUseCase = class GetMyPingsUseCase {
    constructor(pingRepository, threadRepository) {
        this.pingRepository = pingRepository;
        this.threadRepository = threadRepository;
    }
    async execute(authorId) {
        const pings = await this.pingRepository.findByAuthorId(authorId);
        const now = new Date();
        return Promise.all(pings.map(async (ping) => {
            const threads = await this.threadRepository.findByPingId(ping.id);
            const p = ping.toProps();
            return {
                id: p.id,
                message: p.message,
                imageUrl: p.imageUrl,
                color: p.color,
                radiusMeters: p.radiusMeters,
                createdAt: p.createdAt,
                expiresAt: p.expiresAt,
                status: p.status,
                isActive: ping.isActive(now),
                threadCount: threads.length,
            };
        }));
    }
};
exports.GetMyPingsUseCase = GetMyPingsUseCase;
exports.GetMyPingsUseCase = GetMyPingsUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(ping_repository_port_1.PING_REPOSITORY)),
    __param(1, (0, common_1.Inject)(ping_thread_repository_port_1.PING_THREAD_REPOSITORY)),
    __metadata("design:paramtypes", [Object, Object])
], GetMyPingsUseCase);
