import { IsArray, IsString } from 'class-validator';

export class UpdateVisibleCategoriesDto {
  /** Vacío = "quiero ver todas". */
  @IsArray()
  @IsString({ each: true })
  categories!: string[];
}
