import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Ping, PingStatus } from '../../domain/entities/ping.entity';
import { GeoPoint } from '../../domain/value-objects/geo-point.vo';
import { PingRepositoryPort } from '../../domain/ports/ping-repository.port';

interface PingRow {
  id: string;
  authorId: string;
  message: string;
  imageUrl: string | null;
  color: string | null;
  latitude: number;
  longitude: number;
  radiusMeters: number;
  isSocial: boolean;
  categoryKey: string;
  maxRecipients: number;
  deliveredCount: number;
  status: string;
  createdAt: Date;
  expiresAt: Date;
  deletedAt: Date | null;
}

const SELECT_COLUMNS = `
  id, "authorId", message, "imageUrl", color,
  ST_Y(location::geometry) as latitude,
  ST_X(location::geometry) as longitude,
  "radiusMeters", "isSocial", "categoryKey", "maxRecipients", "deliveredCount",
  status, "createdAt", "expiresAt", "deletedAt"
`;

@Injectable()
export class PrismaPingRepository implements PingRepositoryPort {
  constructor(private readonly prisma: PrismaClient) {}

  async save(ping: Ping): Promise<void> {
    const p = ping.toProps();
    await this.prisma.$executeRaw`
      INSERT INTO "Ping" (
        id, "authorId", message, "imageUrl", color, location,
        "radiusMeters", "isSocial", "categoryKey", "maxRecipients", "deliveredCount",
        status, "createdAt", "expiresAt", "deletedAt"
      ) VALUES (
        ${p.id}, ${p.authorId}, ${p.message}, ${p.imageUrl ?? null}, ${p.color ?? null},
        ST_SetSRID(ST_MakePoint(${p.location.longitude}, ${p.location.latitude}), 4326)::geography,
        ${p.radiusMeters}, ${p.isSocial}, ${p.categoryKey}, ${p.maxRecipients}, ${p.deliveredCount},
        ${p.status}, ${p.createdAt}, ${p.expiresAt}, ${p.deletedAt ?? null}
      )
      ON CONFLICT (id) DO UPDATE SET
        "deliveredCount" = EXCLUDED."deliveredCount",
        status = EXCLUDED.status,
        "deletedAt" = EXCLUDED."deletedAt";
    `;
  }

  async findById(id: string): Promise<Ping | null> {
    const rows = await this.prisma.$queryRawUnsafe<PingRow[]>(
      `SELECT ${SELECT_COLUMNS} FROM "Ping" WHERE id = $1 AND "deletedAt" IS NULL;`,
      id,
    );
    return rows[0] ? this.toDomain(rows[0]) : null;
  }

  async findByAuthorId(authorId: string): Promise<Ping[]> {
    const rows = await this.prisma.$queryRawUnsafe<PingRow[]>(
      `SELECT ${SELECT_COLUMNS} FROM "Ping" WHERE "authorId" = $1 AND "deletedAt" IS NULL ORDER BY "createdAt" DESC;`,
      authorId,
    );
    return rows.map((row) => this.toDomain(row));
  }

  async findAll(): Promise<Ping[]> {
    const rows = await this.prisma.$queryRawUnsafe<PingRow[]>(
      `SELECT ${SELECT_COLUMNS} FROM "Ping" WHERE "deletedAt" IS NULL ORDER BY "createdAt" DESC LIMIT 500;`,
    );
    return rows.map((row) => this.toDomain(row));
  }

  async findCollidingWithListeningArea(
    center: GeoPoint,
    listeningRadiusMeters: number,
  ): Promise<Ping[]> {
    // La distancia máxima para que "toquen" dos círculos es la SUMA de
    // sus radios: el de escucha del usuario, más el propio de cada ping
    // (columna "radiusMeters", distinta fila por fila).
    const rows = await this.prisma.$queryRaw<PingRow[]>`
      SELECT id, "authorId", message, "imageUrl", color,
             ST_Y(location::geometry) as latitude,
             ST_X(location::geometry) as longitude,
             "radiusMeters", "isSocial", "categoryKey", "maxRecipients", "deliveredCount",
             status, "createdAt", "expiresAt", "deletedAt"
      FROM "Ping"
      WHERE status = 'active'
        AND "deletedAt" IS NULL
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

  private toDomain(row: PingRow): Ping {
    return Ping.reconstitute({
      id: row.id,
      authorId: row.authorId,
      message: row.message,
      imageUrl: row.imageUrl ?? undefined,
      color: row.color ?? undefined,
      location: GeoPoint.create(row.latitude, row.longitude),
      radiusMeters: row.radiusMeters,
      isSocial: row.isSocial,
      categoryKey: row.categoryKey,
      maxRecipients: row.maxRecipients,
      deliveredCount: row.deliveredCount,
      createdAt: row.createdAt,
      expiresAt: row.expiresAt,
      status: row.status as PingStatus,
      deletedAt: row.deletedAt ?? undefined,
    });
  }
}
