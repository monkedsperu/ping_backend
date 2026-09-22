import { IsUUID } from 'class-validator';

export class AdminCreateBlockDto {
  @IsUUID()
  blockerId!: string;

  @IsUUID()
  blockedId!: string;
}
