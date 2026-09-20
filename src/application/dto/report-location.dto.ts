import { IsInt, IsLatitude, IsLongitude, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

// Igual que en create-ping.dto.ts: solo forma/rango razonable. El
// conjunto EXACTO permitido según el rol vive en ReportLocationUseCase.
export class ReportLocationDto {
  @IsString()
  pushToken!: string;

  @IsLatitude()
  latitude!: number;

  @IsLongitude()
  longitude!: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50000)
  listeningRadiusMeters!: number;
}
