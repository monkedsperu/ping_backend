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
exports.GetNearbyPingsUseCase = void 0;
const common_1 = require("@nestjs/common");
const geo_point_vo_1 = require("../../domain/value-objects/geo-point.vo");
const ping_repository_port_1 = require("../../domain/ports/ping-repository.port");
const ping_thread_repository_port_1 = require("../../domain/ports/ping-thread-repository.port");
/**
 * viewerId es opcional (navegación sin cuenta). Solo cuando hay viewer
 * identificado calculamos isOwnPing/threadCount, y solo para SUS PROPIOS
 * pings — no tiene sentido consultar hilos de pings ajenos solo para
 * mostrar la lista.
 */
let GetNearbyPingsUseCase = class GetNearbyPingsUseCase {
    constructor(pingRepository, threadRepository) {
        this.pingRepository = pingRepository;
        this.threadRepository = threadRepository;
    }
    async execute(dto, viewerId) {
        const center = geo_point_vo_1.GeoPoint.create(dto.latitude, dto.longitude);
        const pings = await this.pingRepository.findCollidingWithListeningArea(center, dto.listeningRadiusMeters);
        const views = await Promise.all(pings.map(async (ping) => {
            const isOwnPing = viewerId !== null && ping.authorId === viewerId;
            const threadCount = isOwnPing
                ? (await this.threadRepository.findByPingId(ping.id)).length
                : 0;
            return {
                id: ping.id,
                message: ping.message,
                imageUrl: ping.imageUrl,
                color: ping.color,
                latitude: ping.location.latitude,
                longitude: ping.location.longitude,
                radiusMeters: ping.radiusMeters,
                distanceMeters: Math.round(center.distanceInMetersTo(ping.location)),
                createdAt: ping.createdAt,
                expiresAt: ping.expiresAt,
                isOwnPing,
                threadCount,
            };
        }));
        return views.sort((a, b) => a.distanceMeters - b.distanceMeters);
    }
};
exports.GetNearbyPingsUseCase = GetNearbyPingsUseCase;
exports.GetNearbyPingsUseCase = GetNearbyPingsUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(ping_repository_port_1.PING_REPOSITORY)),
    __param(1, (0, common_1.Inject)(ping_thread_repository_port_1.PING_THREAD_REPOSITORY)),
    __metadata("design:paramtypes", [Object, Object])
], GetNearbyPingsUseCase);
