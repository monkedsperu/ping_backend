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
exports.AdminGetPingThreadsUseCase = void 0;
const common_1 = require("@nestjs/common");
const ping_repository_port_1 = require("../../domain/ports/ping-repository.port");
const ping_thread_repository_port_1 = require("../../domain/ports/ping-thread-repository.port");
const thread_message_repository_port_1 = require("../../domain/ports/thread-message-repository.port");
const user_repository_port_1 = require("../../domain/ports/user-repository.port");
/** Detalle de un ping para el panel de admin: el mensaje + todas sus
 * conversaciones (quién respondió y un resumen de cada una) — sin la
 * restricción de "solo el autor puede verlo" que sí aplica en la app. */
let AdminGetPingThreadsUseCase = class AdminGetPingThreadsUseCase {
    constructor(pingRepository, threadRepository, messageRepository, userRepository) {
        this.pingRepository = pingRepository;
        this.threadRepository = threadRepository;
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
    }
    async execute(pingId) {
        const ping = await this.pingRepository.findById(pingId);
        if (!ping) {
            throw new common_1.NotFoundException('El ping no existe.');
        }
        const threads = await this.threadRepository.findByPingId(pingId);
        return Promise.all(threads.map(async (thread) => {
            const [responder, messages] = await Promise.all([
                this.userRepository.findById(thread.responderId),
                this.messageRepository.findByThreadId(thread.id),
            ]);
            const last = messages[messages.length - 1]?.toProps();
            return {
                responderId: thread.responderId,
                responderName: responder?.displayName ?? 'Usuario',
                responderEmail: responder?.email ?? '—',
                messageCount: messages.length,
                lastMessage: last?.message,
                lastMessageAt: last?.createdAt,
            };
        }));
    }
};
exports.AdminGetPingThreadsUseCase = AdminGetPingThreadsUseCase;
exports.AdminGetPingThreadsUseCase = AdminGetPingThreadsUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(ping_repository_port_1.PING_REPOSITORY)),
    __param(1, (0, common_1.Inject)(ping_thread_repository_port_1.PING_THREAD_REPOSITORY)),
    __param(2, (0, common_1.Inject)(thread_message_repository_port_1.THREAD_MESSAGE_REPOSITORY)),
    __param(3, (0, common_1.Inject)(user_repository_port_1.USER_REPOSITORY)),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], AdminGetPingThreadsUseCase);
