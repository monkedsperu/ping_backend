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
exports.PrismaUserLocatorRepository = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
let PrismaUserLocatorRepository = class PrismaUserLocatorRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findUsersCollidingWithPing(pingCenter, pingRadiusMeters, excludeUserId) {
        const rows = await this.prisma.$queryRaw `
      SELECT "userId",
             "pushToken",
             ST_Distance(
               location,
               ST_SetSRID(ST_MakePoint(${pingCenter.longitude}, ${pingCenter.latitude}), 4326)::geography
             ) as "distanceMeters"
      FROM "UserLastLocation"
      WHERE "userId" != ${excludeUserId}
        AND "updatedAt" > now() - interval '30 minutes'
        AND ST_DWithin(
          location,
          ST_SetSRID(ST_MakePoint(${pingCenter.longitude}, ${pingCenter.latitude}), 4326)::geography,
          "listeningRadiusMeters" + ${pingRadiusMeters}
        )
      ORDER BY "distanceMeters" ASC;
    `;
        return rows;
    }
};
exports.PrismaUserLocatorRepository = PrismaUserLocatorRepository;
exports.PrismaUserLocatorRepository = PrismaUserLocatorRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [client_1.PrismaClient])
], PrismaUserLocatorRepository);
