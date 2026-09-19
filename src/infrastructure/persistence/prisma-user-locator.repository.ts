import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { GeoPoint } from '../../domain/value-objects/geo-point.vo';
import { NearbyUser, UserLocatorPort } from '../../domain/ports/user-locator.port';

interface NearbyUserRow {
  userId: string;
  pushToken: string;
  distanceMeters: number;
}

@Injectable()
export class PrismaUserLocatorRepository implements UserLocatorPort {
  constructor(private readonly prisma: PrismaClient) {}

  async findUsersCollidingWithPing(
    pingCenter: GeoPoint,
    pingRadiusMeters: number,
    excludeUserId: string,
  ): Promise<NearbyUser[]> {
    const rows = await this.prisma.$queryRaw<NearbyUserRow[]>`
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
}
