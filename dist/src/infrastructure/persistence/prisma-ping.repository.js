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
exports.PrismaPingRepository = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const ping_entity_1 = require("../../domain/entities/ping.entity");
const geo_point_vo_1 = require("../../domain/value-objects/geo-point.vo");
const SELECT_COLUMNS = `
  id, "authorId", message, "imageUrl", color,
  ST_Y(location::geometry) as latitude,
  ST_X(location::geometry) as longitude,
  "radiusMeters", "maxRecipients", "deliveredCount",
  status, "createdAt", "expiresAt"
`;
let PrismaPingRepository = class PrismaPingRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async save(ping) {
        const p = ping.toProps();
        await this.prisma.$executeRaw `
      INSERT INTO "Ping" (
        id, "authorId", message, "imageUrl", color, location,
        "radiusMeters", "maxRecipients", "deliveredCount",
        status, "createdAt", "expiresAt"
      ) VALUES (
        ${p.id}, ${p.authorId}, ${p.message}, ${p.imageUrl ?? null}, ${p.color ?? null},
        ST_SetSRID(ST_MakePoint(${p.location.longitude}, ${p.location.latitude}), 4326)::geography,
        ${p.radiusMeters}, ${p.maxRecipients}, ${p.deliveredCount},
        ${p.status}, ${p.createdAt}, ${p.expiresAt}
      )
      ON CONFLICT (id) DO UPDATE SET
        "deliveredCount" = EXCLUDED."deliveredCount",
        status = EXCLUDED.status;
    `;
    }
    async findById(id) {
        const rows = await this.prisma.$queryRawUnsafe(`SELECT ${SELECT_COLUMNS} FROM "Ping" WHERE id = $1;`, id);
        return rows[0] ? this.toDomain(rows[0]) : null;
    }
    async findByAuthorId(authorId) {
        const rows = await this.prisma.$queryRawUnsafe(`SELECT ${SELECT_COLUMNS} FROM "Ping" WHERE "authorId" = $1 ORDER BY "createdAt" DESC;`, authorId);
        return rows.map((row) => this.toDomain(row));
    }
    async findCollidingWithListeningArea(center, listeningRadiusMeters) {
        // La distancia máxima para que "toquen" dos círculos es la SUMA de
        // sus radios: el de escucha del usuario, más el propio de cada ping
        // (columna "radiusMeters", distinta fila por fila).
        const rows = await this.prisma.$queryRaw `
      SELECT id, "authorId", message, "imageUrl", color,
             ST_Y(location::geometry) as latitude,
             ST_X(location::geometry) as longitude,
             "radiusMeters", "maxRecipients", "deliveredCount",
             status, "createdAt", "expiresAt"
      FROM "Ping"
      WHERE status = 'active'
        AND "expiresAt" > now()
        AND ST_DWithin(
          location,
          ST_SetSRID(ST_MakePoint(${center.longitude}, ${center.latitude}), 4326)::geography,
          ${listeningRadiusMeters} + "radiusMeters"
        )
      ORDER BY "createdAt" DESC;
    `;
        return rows.map((row) => this.toDomain(row));
    }
    toDomain(row) {
        return ping_entity_1.Ping.reconstitute({
            id: row.id,
            authorId: row.authorId,
            message: row.message,
            imageUrl: row.imageUrl ?? undefined,
            color: row.color ?? undefined,
            location: geo_point_vo_1.GeoPoint.create(row.latitude, row.longitude),
            radiusMeters: row.radiusMeters,
            maxRecipients: row.maxRecipients,
            deliveredCount: row.deliveredCount,
            createdAt: row.createdAt,
            expiresAt: row.expiresAt,
            status: row.status,
        });
    }
};
exports.PrismaPingRepository = PrismaPingRepository;
exports.PrismaPingRepository = PrismaPingRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [client_1.PrismaClient])
], PrismaPingRepository);
