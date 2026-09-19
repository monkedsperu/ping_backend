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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaThreadMessageRepository = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const thread_message_entity_1 = require("../../domain/entities/thread-message.entity");
let PrismaThreadMessageRepository = class PrismaThreadMessageRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async save(message) {
        const m = message.toProps();
        await this.prisma.threadMessage.create({
            data: {
                id: m.id,
                threadId: m.threadId,
                senderId: m.senderId,
                message: m.message,
                imageUrl: m.imageUrl ?? null,
                createdAt: m.createdAt,
            },
        });
    }
    async findByThreadId(threadId) {
        const rows = await this.prisma.threadMessage.findMany({
            where: { threadId },
            orderBy: { createdAt: 'asc' },
        });
        return rows.map((row) => this.toDomain(row));
    }
    async findLastByThreadId(threadId) {
        const row = await this.prisma.threadMessage.findFirst({
            where: { threadId },
            orderBy: { createdAt: 'desc' },
        });
        return row ? this.toDomain(row) : null;
    }
    toDomain(row) {
        return thread_message_entity_1.ThreadMessage.reconstitute({
            id: row.id,
            threadId: row.threadId,
            senderId: row.senderId,
            message: row.message,
            imageUrl: row.imageUrl ?? undefined,
            createdAt: row.createdAt,
        });
    }
};
exports.PrismaThreadMessageRepository = PrismaThreadMessageRepository;
exports.PrismaThreadMessageRepository = PrismaThreadMessageRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [client_1.PrismaClient])
], PrismaThreadMessageRepository);
