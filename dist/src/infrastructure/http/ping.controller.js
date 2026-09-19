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
exports.PingController = void 0;
const common_1 = require("@nestjs/common");
const create_ping_use_case_1 = require("../../application/use-cases/create-ping.use-case");
const get_nearby_pings_use_case_1 = require("../../application/use-cases/get-nearby-pings.use-case");
const get_ping_detail_use_case_1 = require("../../application/use-cases/get-ping-detail.use-case");
const start_thread_use_case_1 = require("../../application/use-cases/start-thread.use-case");
const send_thread_message_use_case_1 = require("../../application/use-cases/send-thread-message.use-case");
const get_ping_threads_use_case_1 = require("../../application/use-cases/get-ping-threads.use-case");
const get_my_pings_use_case_1 = require("../../application/use-cases/get-my-pings.use-case");
const get_my_responses_use_case_1 = require("../../application/use-cases/get-my-responses.use-case");
const get_thread_messages_use_case_1 = require("../../application/use-cases/get-thread-messages.use-case");
const create_ping_dto_1 = require("../../application/dto/create-ping.dto");
const get_nearby_pings_dto_1 = require("../../application/dto/get-nearby-pings.dto");
const thread_message_dto_1 = require("../../application/dto/thread-message.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const optional_jwt_auth_guard_1 = require("../auth/optional-jwt-auth.guard");
const current_user_decorator_1 = require("../auth/current-user.decorator");
let PingController = class PingController {
    constructor(createPing, getNearbyPings, getPingDetail, startThread, sendThreadMessage, getPingThreads, getMyPings, getMyResponses, getThreadMessages) {
        this.createPing = createPing;
        this.getNearbyPings = getNearbyPings;
        this.getPingDetail = getPingDetail;
        this.startThread = startThread;
        this.sendThreadMessage = sendThreadMessage;
        this.getPingThreads = getPingThreads;
        this.getMyPings = getMyPings;
        this.getMyResponses = getMyResponses;
        this.getThreadMessages = getThreadMessages;
    }
    // --- Lectura: navegable sin cuenta ---
    async findNearby(viewerId, query) {
        return this.getNearbyPings.execute(query, viewerId);
    }
    async findMine(authorId) {
        return this.getMyPings.execute(authorId);
    }
    async findMyResponses(responderId) {
        return this.getMyResponses.execute(responderId);
    }
    async findOne(viewerId, id) {
        return this.getPingDetail.execute(id, viewerId);
    }
    // --- Escritura: requiere cuenta ---
    async create(authorId, dto) {
        const result = await this.createPing.execute(dto, authorId);
        return {
            id: result.ping.id,
            notifiedCount: result.notifiedCount,
            expiresAt: result.ping.expiresAt,
        };
    }
    /** El autor ve la lista de conversaciones que le han abierto. */
    async listThreads(viewerId, pingId) {
        return this.getPingThreads.execute(pingId, viewerId);
    }
    /** Iniciar una conversación nueva (primer mensaje de un respondiente). */
    async createThread(responderId, pingId, dto) {
        const result = await this.startThread.execute(pingId, dto, responderId);
        return result.message.toProps();
    }
    /** Ver los mensajes de un hilo (solo los dos participantes pueden). */
    async getThread(viewerId, pingId, responderId) {
        return this.getThreadMessages.execute(pingId, responderId, viewerId);
    }
    /** Continuar una conversación existente. */
    async replyInThread(senderId, pingId, responderId, dto) {
        const message = await this.sendThreadMessage.execute(pingId, responderId, dto, senderId);
        return message.toProps();
    }
};
exports.PingController = PingController;
__decorate([
    (0, common_1.UseGuards)(optional_jwt_auth_guard_1.OptionalJwtAuthGuard),
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_1.CurrentUserIdOptional)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, get_nearby_pings_dto_1.GetNearbyPingsDto]),
    __metadata("design:returntype", Promise)
], PingController.prototype, "findNearby", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('mine'),
    __param(0, (0, current_user_decorator_1.CurrentUserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PingController.prototype, "findMine", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('mine/responses'),
    __param(0, (0, current_user_decorator_1.CurrentUserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PingController.prototype, "findMyResponses", null);
__decorate([
    (0, common_1.UseGuards)(optional_jwt_auth_guard_1.OptionalJwtAuthGuard),
    (0, common_1.Get)(':id'),
    __param(0, (0, current_user_decorator_1.CurrentUserIdOptional)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], PingController.prototype, "findOne", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(),
    __param(0, (0, current_user_decorator_1.CurrentUserId)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_ping_dto_1.CreatePingDto]),
    __metadata("design:returntype", Promise)
], PingController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(':id/threads'),
    __param(0, (0, current_user_decorator_1.CurrentUserId)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PingController.prototype, "listThreads", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(':id/threads'),
    __param(0, (0, current_user_decorator_1.CurrentUserId)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, thread_message_dto_1.SendThreadMessageDto]),
    __metadata("design:returntype", Promise)
], PingController.prototype, "createThread", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(':id/threads/:responderId'),
    __param(0, (0, current_user_decorator_1.CurrentUserId)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Param)('responderId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], PingController.prototype, "getThread", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(':id/threads/:responderId'),
    __param(0, (0, current_user_decorator_1.CurrentUserId)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Param)('responderId')),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, thread_message_dto_1.SendThreadMessageDto]),
    __metadata("design:returntype", Promise)
], PingController.prototype, "replyInThread", null);
exports.PingController = PingController = __decorate([
    (0, common_1.Controller)('pings'),
    __metadata("design:paramtypes", [create_ping_use_case_1.CreatePingUseCase,
        get_nearby_pings_use_case_1.GetNearbyPingsUseCase,
        get_ping_detail_use_case_1.GetPingDetailUseCase,
        start_thread_use_case_1.StartThreadUseCase,
        send_thread_message_use_case_1.SendThreadMessageUseCase,
        get_ping_threads_use_case_1.GetPingThreadsUseCase,
        get_my_pings_use_case_1.GetMyPingsUseCase,
        get_my_responses_use_case_1.GetMyResponsesUseCase,
        get_thread_messages_use_case_1.GetThreadMessagesUseCase])
], PingController);
