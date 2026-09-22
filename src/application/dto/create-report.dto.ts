import { IsOptional, IsString, IsUUID, Length } from 'class-validator';

export class CreateReportDto {
  @IsUUID()
  reportedUserId!: string;

  @IsOptional()
  @IsUUID()
  pingId?: string;

  @IsString()
  @Length(5, 500)
  reason!: string;
}
