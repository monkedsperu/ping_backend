import { ArrayMinSize, IsArray, IsInt, Min } from 'class-validator';

export class SetRoleLimitsDto {
  @IsArray()
  @ArrayMinSize(1)
  @IsInt({ each: true })
  @Min(1, { each: true })
  allowedPingRadii!: number[];

  @IsArray()
  @ArrayMinSize(1)
  @IsInt({ each: true })
  @Min(1, { each: true })
  allowedListeningRadii!: number[];

  @IsArray()
  @ArrayMinSize(1)
  @IsInt({ each: true })
  @Min(1, { each: true })
  allowedDurations!: number[];
}

export class SetMessageLimitsDto {
  @IsInt()
  @Min(1)
  minMessageLength!: number;

  @IsInt()
  @Min(1)
  maxMessageLength!: number;
}
