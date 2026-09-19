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
exports.GetThreadMessagesUseCase = void 0;
const common_1 = require("@nestjs/common");
const ping_repository_port_1 = require("../../domain/ports/ping-repository.port");
const ping_thread_repository_port_1 = require("../../domain/ports/ping-thread-repository.port");
const thread_message_repository_port_1 = require("../../domain/ports/thread-message-repository.port");
const user_repository_port_1 = require("../../domain/ports/user-repository.port");
let GetThreadMessagesUseCase = class GetThreadMessagesUseCase {
    constructor(pingRepository, threadRepository, messageRepository, userRepository) {
        this.pingRepository = pingRepository;
        this.threadRepository = threadRepository;
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
    }
    async execute(pingId, responderIdInThread, viewerId) {
        const ping = await this.pingRepository.findById(pingId);
        if (!ping) {
            throw new common_1.NotFoundException('El ping no existe.');
        }
        const thread = await this.threadRepository.findByPingAndResponder(pingId, responderIdInThread);
        if (!thread) {
            throw new common_1.NotFoundException('Esta conversación no existe todavía.');
        }
        const isParticipant = viewerId === ping.authorId || viewerId === responderIdInThread;
        if (!isParticipant) {
            throw new common_1.ForbiddenException('No formas parte de esta conversación.');
        }
        const otherParticipantId = viewerId === ping.authorId ? responderIdInThread : ping.authorId;
        const [messages, otherParticipant] = await Promise.all([
            this.messageRepository.findByThreadId(thread.id),
            this.userRepository.findById(otherParticipantId),
        ]);
        return {
            pingId,
            responderId: responderIdInThread,
            otherParticipantName: otherParticipant?.displayName ?? 'Usuario',
            messages: messages.map((m) => m.toProps()),
        };
    }
};
exports.GetThreadMessagesUseCase = GetThreadMessagesUseCase;
exports.GetThreadMessagesUseCase = GetThreadMessagesUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(ping_repository_port_1.PING_REPOSITORY)),
    __param(1, (0, common_1.Inject)(ping_thread_repository_port_1.PING_THREAD_REPOSITORY)),
    __param(2, (0, common_1.Inject)(thread_message_repository_port_1.THREAD_MESSAGE_REPOSITORY)),
    __param(3, (0, common_1.Inject)(user_repository_port_1.USER_REPOSITORY)),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], GetThreadMessagesUseCase);
