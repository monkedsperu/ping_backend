import {
  IsBoolean,
  IsHexColor,
  IsInt,
  IsLatitude,
  IsLongitude,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

// Validación de FORMA solamente (tipo, rango razonable) — cuáles valores
// exactos están permitidos depende del rol del autor y de la
// configuración del admin, así que esa regla vive en CreatePingUseCase /
// Ping.create(), no aquí.
export class CreatePingDto {
  @IsString()
  @Length(1, 1000)
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
  @IsInt()
  @Min(1)
  @Max(20000)
  radiusMeters?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(43200) // 30 días, tope absoluto de cordura
  durationMinutes?: number;

  @IsOptional()
  @IsBoolean()
  isSocial?: boolean;

  @IsOptional()
  @IsString()
  categoryKey?: string;
}
