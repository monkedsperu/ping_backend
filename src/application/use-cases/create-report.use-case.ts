import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { REPORT_REPOSITORY, ReportRepositoryPort } from '../../domain/ports/report-repository.port';
import { CreateReportDto } from '../dto/create-report.dto';

@Injectable()
export class CreateReportUseCase {
  constructor(
    @Inject(REPORT_REPOSITORY) private readonly reportRepository: ReportRepositoryPort,
  ) {}

  async execute(reporterId: string, dto: CreateReportDto) {
    if (dto.reportedUserId === reporterId) {
      throw new BadRequestException('No puedes denunciarte a ti mismo.');
    }
    return this.reportRepository.create({
      id: randomUUID(),
      reporterId,
      reportedUserId: dto.reportedUserId,
      pingId: dto.pingId,
      reason: dto.reason,
      now: new Date(),
    });
  }
}
