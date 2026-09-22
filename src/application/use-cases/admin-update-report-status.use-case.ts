import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { REPORT_REPOSITORY, ReportRepositoryPort, ReportStatus } from '../../domain/ports/report-repository.port';

@Injectable()
export class AdminUpdateReportStatusUseCase {
  constructor(
    @Inject(REPORT_REPOSITORY) private readonly reportRepository: ReportRepositoryPort,
  ) {}

  async execute(reportId: string, status: ReportStatus, adminId: string): Promise<void> {
    const report = await this.reportRepository.findById(reportId);
    if (!report) {
      throw new NotFoundException('La denuncia no existe.');
    }
    await this.reportRepository.updateStatus(reportId, status, adminId, new Date());
  }
}
