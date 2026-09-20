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
exports.PrismaSettingsRepository = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const role_limits_defaults_1 = require("../../domain/entities/role-limits.defaults");
let PrismaSettingsRepository = class PrismaSettingsRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getRoleLimits(role) {
        const row = await this.prisma.roleLimits.findUnique({ where: { role } });
        if (!row)
            return role_limits_defaults_1.DEFAULT_ROLE_LIMITS[role];
        return {
            role,
            allowedPingRadii: row.allowedPingRadii,
            allowedListeningRadii: row.allowedListeningRadii,
            allowedDurations: row.allowedDurations,
        };
    }
    async getAllRoleLimits() {
        const roles = ['user', 'premium', 'mod', 'admin'];
        return Promise.all(roles.map((role) => this.getRoleLimits(role)));
    }
    async saveRoleLimits(value) {
        await this.prisma.roleLimits.upsert({
            where: { role: value.role },
            create: {
                role: value.role,
                allowedPingRadii: value.allowedPingRadii,
                allowedListeningRadii: value.allowedListeningRadii,
                allowedDurations: value.allowedDurations,
            },
            update: {
                allowedPingRadii: value.allowedPingRadii,
                allowedListeningRadii: value.allowedListeningRadii,
                allowedDurations: value.allowedDurations,
            },
        });
    }
    async getMessageLimits() {
        const row = await this.prisma.platformSettings.findUnique({ where: { id: 'default' } });
        if (!row)
            return role_limits_defaults_1.DEFAULT_MESSAGE_LIMITS;
        return { minMessageLength: row.minMessageLength, maxMessageLength: row.maxMessageLength };
    }
    async saveMessageLimits(value) {
        await this.prisma.platformSettings.upsert({
            where: { id: 'default' },
            create: { id: 'default', ...value },
            update: value,
        });
    }
};
exports.PrismaSettingsRepository = PrismaSettingsRepository;
exports.PrismaSettingsRepository = PrismaSettingsRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [client_1.PrismaClient])
], PrismaSettingsRepository);
