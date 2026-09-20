import { IsBoolean } from 'class-validator';

export class AdminSetDisabledDto {
  @IsBoolean()
  disabled!: boolean;
}
