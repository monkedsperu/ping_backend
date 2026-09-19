import { IsHexColor, IsIn, IsLatitude, IsLongitude, IsOptional, IsString, Length } from 'class-validator';
import { Type } from 'class-transformer';
import { ALLOWED_DURATION_MINUTES, ALLOWED_RADIUS_METERS } from '../../domain/entities/ping.entity';

export class CreatePingDto {
  @IsString()
  @Length(5, 280)
  message!: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsHexColor()
  color?: string;

  @IsLatitude()
  latitude!: number;

  @IsLongitude()
  longitude!: number;

  @IsOptional()
  @Type(() => Number)
  @IsIn(ALLOWED_RADIUS_METERS)
  radiusMeters?: number;

  @IsOptional()
  @Type(() => Number)
  @IsIn(ALLOWED_DURATION_MINUTES)
  durationMinutes?: number;
}
