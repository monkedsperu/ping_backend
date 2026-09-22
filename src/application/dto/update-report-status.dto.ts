import { IsIn } from 'class-validator';

export class UpdateReportStatusDto {
  @IsIn(['reviewed', 'dismissed'])
  status!: 'reviewed' | 'dismissed';
}
