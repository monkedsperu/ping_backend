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
exports.SendThreadMessageUseCase = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const thread_message_entity_1 = require("../../domain/entities/thread-message.entity");
const ping_repository_port_1 = require("../../domain/ports/ping-repository.port");
const ping_thread_repository_port_1 = require("../../domain/ports/ping-thread-repository.port");
const thread_message_repository_port_1 = require("../../domain/ports/thread-message-repository.port");
/**
 * Un hilo tiene exactamente dos participantes posibles: el autor del ping
 * y el respondiente original. Cualquier otra persona que intente escribir
 * ahí (incluso otro usuario autenticado válido) debe ser rechazada — esto
 * es lo que mantiene cada conversación privada entre esos dos.
 */
let SendThreadMessageUseCase = class SendThreadMessageUseCase {
    constructor(pingRepository, threadRepository, messageRepository) {
        this.pingRepository = pingRepository;
        this.threadRepository = threadRepository;
        this.messageRepository = messageRepository;
    }
    async execute(pingId, responderIdInThread, dto, senderId) {
        const ping = await this.pingRepository.findById(pingId);
        if (!ping) {
            throw new common_1.NotFoundException('El ping no existe.');
        }
        if (!ping.isActive(new Date())) {
            throw new common_1.ForbiddenException('Este ping ya expiró; la conversación quedó congelada.');
        }
        const thread = await this.threadRepository.findByPingAndResponder(pingId, responderIdInThread);
        if (!thread) {
            throw new common_1.NotFoundException('Esta conversación no existe todavía.');
        }
        const isParticipant = senderId === ping.authorId || senderId === responderIdInThread;
        if (!isParticipant) {
            throw new common_1.ForbiddenException('No formas parte de esta conversación.');
        }
        const message = thread_message_entity_1.ThreadMessage.create({
            id: (0, crypto_1.randomUUID)(),
            threadId: thread.id,
            senderId,
            message: dto.message,
            imageUrl: dto.imageUrl,
            now: new Date(),
        });
        await this.messageRepository.save(message);
        return message;
    }
};
exports.SendThreadMessageUseCase = SendThreadMessageUseCase;
exports.SendThreadMessageUseCase = SendThreadMessageUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(ping_repository_port_1.PING_REPOSITORY)),
    __param(1, (0, common_1.Inject)(ping_thread_repository_port_1.PING_THREAD_REPOSITORY)),
    __param(2, (0, common_1.Inject)(thread_message_repository_port_1.THREAD_MESSAGE_REPOSITORY)),
    __metadata("design:paramtypes", [Object, Object, Object])
], SendThreadMessageUseCase);
