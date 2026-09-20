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
exports.AdminGetConversationUseCase = void 0;
const common_1 = require("@nestjs/common");
const ping_thread_repository_port_1 = require("../../domain/ports/ping-thread-repository.port");
const thread_message_repository_port_1 = require("../../domain/ports/thread-message-repository.port");
const ping_repository_port_1 = require("../../domain/ports/ping-repository.port");
const user_repository_port_1 = require("../../domain/ports/user-repository.port");
/** El historial completo de una conversación puntual — para auditoría.
 * Sí, se guarda cada mensaje con su remitente y fecha, para siempre
 * (mientras el ping/thread no se borre de la base). */
let AdminGetConversationUseCase = class AdminGetConversationUseCase {
    constructor(threadRepository, messageRepository, pingRepository, userRepository) {
        this.threadRepository = threadRepository;
        this.messageRepository = messageRepository;
        this.pingRepository = pingRepository;
        this.userRepository = userRepository;
    }
    async execute(pingId, responderId) {
        const thread = await this.threadRepository.findByPingAndResponder(pingId, responderId);
        if (!thread) {
            throw new common_1.NotFoundException('Esa conversación no existe.');
        }
        const ping = await this.pingRepository.findById(pingId);
        // Un hilo solo tiene 2 participantes posibles: el autor del ping y
        // quien respondió — resolvemos ambos nombres una sola vez.
        const [author, responder] = await Promise.all([
            ping ? this.userRepository.findById(ping.toProps().authorId) : null,
            this.userRepository.findById(responderId),
        ]);
        const nameById = new Map();
        if (author)
            nameById.set(author.id, author.displayName);
        if (responder)
            nameById.set(responder.id, responder.displayName);
        const messages = await this.messageRepository.findByThreadId(thread.id);
        return messages.map((m) => {
            const p = m.toProps();
            return { ...p, senderName: nameById.get(p.senderId) ?? 'Usuario' };
        });
    }
};
exports.AdminGetConversationUseCase = AdminGetConversationUseCase;
exports.AdminGetConversationUseCase = AdminGetConversationUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(ping_thread_repository_port_1.PING_THREAD_REPOSITORY)),
    __param(1, (0, common_1.Inject)(thread_message_repository_port_1.THREAD_MESSAGE_REPOSITORY)),
    __param(2, (0, common_1.Inject)(ping_repository_port_1.PING_REPOSITORY)),
    __param(3, (0, common_1.Inject)(user_repository_port_1.USER_REPOSITORY)),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], AdminGetConversationUseCase);
