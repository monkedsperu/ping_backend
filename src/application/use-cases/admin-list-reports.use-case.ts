import { Inject, Injectable } from '@nestjs/common';
import { REPORT_REPOSITORY, ReportRepositoryPort, ReportStatus } from '../../domain/ports/report-repository.port';
import { USER_REPOSITORY, UserRepositoryPort } from '../../domain/ports/user-repository.port';

export interface AdminReportView {
  id: string;
  reporterId: string;
  reporterName: string;
  reportedUserId: string;
  reportedUserName: string;
  pingId?: string;
  reason: string;
  status: ReportStatus;
  createdAt: Date;
  reviewedAt?: Date;
}

@Injectable()
export class AdminListReportsUseCase {
  constructor(
    @Inject(REPORT_REPOSITORY) private readonly reportRepository: ReportRepositoryPort,
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepositoryPort,
  ) {}

  async execute(status?: ReportStatus): Promise<AdminReportView[]> {
    const reports = await this.reportRepository.findAll(status);
    return Promise.all(
      reports.map(async (r) => {
        const [reporter, reported] = await Promise.all([
          this.userRepository.findById(r.reporterId),
          this.userRepository.findById(r.reportedUserId),
        ]);
        return {
          id: r.id,
          reporterId: r.reporterId,
          reporterName: reporter?.displayName ?? 'Usuario',
          reportedUserId: r.reportedUserId,
          reportedUserName: reported?.displayName ?? 'Usuario',
          pingId: r.pingId,
          reason: r.reason,
          status: r.status,
          createdAt: r.createdAt,
          reviewedAt: r.reviewedAt,
        };
      }),
    );
  }
}
