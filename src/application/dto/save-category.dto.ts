import { IsBoolean, IsInt, IsOptional, IsString, Length } from 'class-validator';

export class SaveCategoryDto {
  @IsString()
  @Length(1, 40)
  label!: string;

  @IsOptional()
  @IsString()
  icon?: string;

  @IsBoolean()
  isActive!: boolean;

  @IsInt()
  sortOrder!: number;
}
