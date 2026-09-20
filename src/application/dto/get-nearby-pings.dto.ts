import { IsInt, IsLatitude, IsLongitude, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class GetNearbyPingsDto {
  @Type(() => Number)
  @IsLatitude()
  latitude!: number;

  @Type(() => Number)
  @IsLongitude()
  longitude!: number;

  /** Tu radio de escucha ahora mismo — ver Ping.findCollidingWithListeningArea.
   * El conjunto exacto permitido según el rol vive en GetNearbyPingsUseCase. */
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50000)
  listeningRadiusMeters!: number;
}
