import { IsIn, IsLatitude, IsLongitude, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export const ALLOWED_LISTENING_RADIUS_METERS = [100, 200, 500, 1000, 2000] as const;

export class ReportLocationDto {
  @IsString()
  pushToken!: string;

  @IsLatitude()
  latitude!: number;

  @IsLongitude()
  longitude!: number;

  @Type(() => Number)
  @IsIn(ALLOWED_LISTENING_RADIUS_METERS)
  listeningRadiusMeters!: number;
}
