import { IsIn, IsLatitude, IsLongitude } from 'class-validator';
import { Type } from 'class-transformer';
import { ALLOWED_LISTENING_RADIUS_METERS } from './report-location.dto';

export class GetNearbyPingsDto {
  @Type(() => Number)
  @IsLatitude()
  latitude!: number;

  @Type(() => Number)
  @IsLongitude()
  longitude!: number;

  /** Tu radio de escucha ahora mismo — ver Ping.findCollidingWithListeningArea. */
  @Type(() => Number)
  @IsIn(ALLOWED_LISTENING_RADIUS_METERS)
  listeningRadiusMeters!: number;
}
