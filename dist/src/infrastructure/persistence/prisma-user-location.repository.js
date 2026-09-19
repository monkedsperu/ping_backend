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
exports.PrismaUserLocationRepository = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
let PrismaUserLocationRepository = class PrismaUserLocationRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async upsert(userId, pushToken, latitude, longitude, listeningRadiusMeters) {
        await this.prisma.$executeRaw `
      INSERT INTO "UserLastLocation" ("userId", "pushToken", location, "listeningRadiusMeters", "updatedAt")
      VALUES (
        ${userId}, ${pushToken},
        ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326)::geography,
        ${listeningRadiusMeters},
        now()
      )
      ON CONFLICT ("userId") DO UPDATE SET
        "pushToken" = EXCLUDED."pushToken",
        location = EXCLUDED.location,
        "listeningRadiusMeters" = EXCLUDED."listeningRadiusMeters",
        "updatedAt" = now();
    `;
    }
};
exports.PrismaUserLocationRepository = PrismaUserLocationRepository;
exports.PrismaUserLocationRepository = PrismaUserLocationRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [client_1.PrismaClient])
], PrismaUserLocationRepository);
