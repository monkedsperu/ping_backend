import { IsOptional, IsString, Length } from 'class-validator';

export class SendThreadMessageDto {
  @IsString()
  @Length(1, 500)
  message!: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;
}
