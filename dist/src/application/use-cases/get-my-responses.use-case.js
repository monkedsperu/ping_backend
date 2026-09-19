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
exports.GetMyResponsesUseCase = void 0;
const common_1 = require("@nestjs/common");
const ping_repository_port_1 = require("../../domain/ports/ping-repository.port");
const ping_thread_repository_port_1 = require("../../domain/ports/ping-thread-repository.port");
const thread_message_repository_port_1 = require("../../domain/ports/thread-message-repository.port");
const user_repository_port_1 = require("../../domain/ports/user-repository.port");
/**
 * "Mis respuestas": una conversación que ya empezaste no debería
 * desaparecer solo porque tu radio de escucha ya no cubre ese ping —
 * esta lista es tu forma de encontrarla de nuevo, hasta que expire.
 */
let GetMyResponsesUseCase = class GetMyResponsesUseCase {
    constructor(pingRepository, threadRepository, messageRepository, userRepository) {
        this.pingRepository = pingRepository;
        this.threadRepository = threadRepository;
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
    }
    async execute(responderId) {
        const threads = await this.threadRepository.findByResponderId(responderId);
        const now = new Date();
        const views = await Promise.all(threads.map(async (thread) => {
            const ping = await this.pingRepository.findById(thread.pingId);
            if (!ping)
                return null; // defensivo: no debería pasar, pero no tronamos la lista entera por uno
            const [lastMessage, author] = await Promise.all([
                this.messageRepository.findLastByThreadId(thread.id),
                this.userRepository.findById(ping.authorId),
            ]);
            const p = ping.toProps();
            const view = {
                pingId: p.id,
                responderId,
                pingMessage: p.message,
                authorName: author?.displayName ?? 'Usuario',
                color: p.color,
                lastMessage: lastMessage?.toProps().message ?? '',
                lastMessageAt: lastMessage?.toProps().createdAt ?? thread.createdAt,
                isPingActive: ping.isActive(now),
                pingExpiresAt: p.expiresAt,
            };
            return view;
        }));
        return views
            .filter((v) => v !== null)
            .sort((a, b) => b.lastMessageAt.getTime() - a.lastMessageAt.getTime());
    }
};
exports.GetMyResponsesUseCase = GetMyResponsesUseCase;
exports.GetMyResponsesUseCase = GetMyResponsesUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(ping_repository_port_1.PING_REPOSITORY)),
    __param(1, (0, common_1.Inject)(ping_thread_repository_port_1.PING_THREAD_REPOSITORY)),
    __param(2, (0, common_1.Inject)(thread_message_repository_port_1.THREAD_MESSAGE_REPOSITORY)),
    __param(3, (0, common_1.Inject)(user_repository_port_1.USER_REPOSITORY)),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], GetMyResponsesUseCase);
