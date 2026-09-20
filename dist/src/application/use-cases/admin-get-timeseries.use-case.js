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
exports.AdminGetTimeseriesUseCase = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const DAYS = 14;
function dayKey(d) {
    return d.toISOString().slice(0, 10);
}
/** Serie de los últimos 14 días, para los gráficos del dashboard.
 * Se agrega en JS en vez de SQL para mantenerlo simple — a esta escala
 * (piloto) trae todas las filas del rango y las agrupa por día. */
let AdminGetTimeseriesUseCase = class AdminGetTimeseriesUseCase {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async execute() {
        const since = new Date();
        since.setDate(since.getDate() - (DAYS - 1));
        since.setHours(0, 0, 0, 0);
        const [users, pings, messages] = await Promise.all([
            this.prisma.user.findMany({ where: { createdAt: { gte: since } }, select: { createdAt: true } }),
            this.prisma.ping.findMany({ where: { createdAt: { gte: since } }, select: { createdAt: true } }),
            this.prisma.threadMessage.findMany({
                where: { createdAt: { gte: since } },
                select: { createdAt: true },
            }),
        ]);
        const days = [];
        for (let i = 0; i < DAYS; i++) {
            const d = new Date(since);
            d.setDate(d.getDate() + i);
            const key = dayKey(d);
            days.push({
                date: key,
                newUsers: users.filter((u) => dayKey(u.createdAt) === key).length,
                newPings: pings.filter((p) => dayKey(p.createdAt) === key).length,
                newMessages: messages.filter((m) => dayKey(m.createdAt) === key).length,
            });
        }
        return days;
    }
};
exports.AdminGetTimeseriesUseCase = AdminGetTimeseriesUseCase;
exports.AdminGetTimeseriesUseCase = AdminGetTimeseriesUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [client_1.PrismaClient])
], AdminGetTimeseriesUseCase);
