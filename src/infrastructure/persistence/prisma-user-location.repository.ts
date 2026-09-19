import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { UserLocationRepositoryPort } from '../../domain/ports/user-location-repository.port';

@Injectable()
export class PrismaUserLocationRepository implements UserLocationRepositoryPort {
  constructor(private readonly prisma: PrismaClient) {}

  async upsert(
    userId: string,
    pushToken: string,
    latitude: number,
    longitude: number,
    listeningRadiusMeters: number,
  ): Promise<void> {
    await this.prisma.$executeRaw`
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
}
