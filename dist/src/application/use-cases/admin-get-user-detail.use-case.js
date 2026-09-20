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
exports.AdminGetUserDetailUseCase = void 0;
const common_1 = require("@nestjs/common");
const user_repository_port_1 = require("../../domain/ports/user-repository.port");
const ping_repository_port_1 = require("../../domain/ports/ping-repository.port");
const ping_thread_repository_port_1 = require("../../domain/ports/ping-thread-repository.port");
/** "Actividad de un usuario": qué anuncios ha creado y en cuáles ha
 * respondido — lo mínimo útil para entender el comportamiento de una
 * cuenta sin tener que cruzar tablas a mano. */
let AdminGetUserDetailUseCase = class AdminGetUserDetailUseCase {
    constructor(userRepository, pingRepository, threadRepository) {
        this.userRepository = userRepository;
        this.pingRepository = pingRepository;
        this.threadRepository = threadRepository;
    }
    async execute(userId) {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new common_1.NotFoundException('Usuario no encontrado.');
        }
        const now = new Date();
        const [ownPings, respondedThreads] = await Promise.all([
            this.pingRepository.findByAuthorId(userId),
            this.threadRepository.findByResponderId(userId),
        ]);
        const createdPings = await Promise.all(ownPings.map(async (ping) => {
            const threads = await this.threadRepository.findByPingId(ping.id);
            const p = ping.toProps();
            return {
                id: p.id,
                message: p.message,
                createdAt: p.createdAt,
                isActive: ping.isActive(now),
                threadCount: threads.length,
            };
        }));
        const respondedTo = await Promise.all(respondedThreads.map(async (thread) => {
            const ping = await this.pingRepository.findById(thread.pingId);
            const p = ping?.toProps();
            return {
                pingId: thread.pingId,
                pingMessage: p?.message ?? '(anuncio eliminado)',
                pingAuthorId: p?.authorId ?? '',
                respondedAt: thread.createdAt,
            };
        }));
        return {
            id: user.id,
            email: user.email,
            displayName: user.displayName,
            role: user.role,
            isDisabled: user.isDisabled,
            hasGoogle: Boolean(user.googleId),
            createdAt: user.createdAt,
            createdPings,
            respondedTo,
        };
    }
};
exports.AdminGetUserDetailUseCase = AdminGetUserDetailUseCase;
exports.AdminGetUserDetailUseCase = AdminGetUserDetailUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(user_repository_port_1.USER_REPOSITORY)),
    __param(1, (0, common_1.Inject)(ping_repository_port_1.PING_REPOSITORY)),
    __param(2, (0, common_1.Inject)(ping_thread_repository_port_1.PING_THREAD_REPOSITORY)),
    __metadata("design:paramtypes", [Object, Object, Object])
], AdminGetUserDetailUseCase);
