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
exports.PrismaUserRepository = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const user_entity_1 = require("../../domain/entities/user.entity");
let PrismaUserRepository = class PrismaUserRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async save(user) {
        await this.prisma.user.upsert({
            where: { id: user.id },
            create: {
                id: user.id,
                email: user.email,
                passwordHash: user.passwordHash ?? null,
                googleId: user.googleId ?? null,
                displayName: user.displayName,
                createdAt: user.createdAt,
            },
            update: {
                displayName: user.displayName,
                googleId: user.googleId ?? null,
            },
        });
    }
    async findByEmail(email) {
        const row = await this.prisma.user.findUnique({ where: { email: email.toLowerCase() } });
        return row ? this.toDomain(row) : null;
    }
    async findById(id) {
        const row = await this.prisma.user.findUnique({ where: { id } });
        return row ? this.toDomain(row) : null;
    }
    async findByGoogleId(googleId) {
        const row = await this.prisma.user.findUnique({ where: { googleId } });
        return row ? this.toDomain(row) : null;
    }
    async upsertGoogleAccount(input) {
        const row = await this.prisma.user.upsert({
            where: { email: input.email },
            create: {
                id: input.newId,
                email: input.email,
                googleId: input.googleId,
                displayName: input.displayName,
                passwordHash: null,
            },
            // Si ya existía (creado antes con contraseña, o un intento previo
            // de Google), solo vinculamos el googleId — no pisamos el nombre
            // ni la contraseña que ya tenía.
            update: { googleId: input.googleId },
        });
        return this.toDomain(row);
    }
    toDomain(row) {
        return user_entity_1.User.reconstitute({
            id: row.id,
            email: row.email,
            passwordHash: row.passwordHash ?? undefined,
            googleId: row.googleId ?? undefined,
            displayName: row.displayName,
            createdAt: row.createdAt,
        });
    }
};
exports.PrismaUserRepository = PrismaUserRepository;
exports.PrismaUserRepository = PrismaUserRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [client_1.PrismaClient])
], PrismaUserRepository);
