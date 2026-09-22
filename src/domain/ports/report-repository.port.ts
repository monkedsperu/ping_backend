export type ReportStatus = 'pending' | 'reviewed' | 'dismissed';

export interface ReportRecord {
  id: string;
  reporterId: string;
  reportedUserId: string;
  pingId?: string;
  reason: string;
  status: ReportStatus;
  createdAt: Date;
  reviewedAt?: Date;
  reviewedById?: string;
}

export interface ReportRepositoryPort {
  create(input: {
    id: string;
    reporterId: string;
    reportedUserId: string;
    pingId?: string;
    reason: string;
    now: Date;
  }): Promise<ReportRecord>;
  findAll(status?: ReportStatus): Promise<ReportRecord[]>;
  findById(id: string): Promise<ReportRecord | null>;
  updateStatus(id: string, status: ReportStatus, reviewedById: string, now: Date): Promise<void>;
}

export const REPORT_REPOSITORY = Symbol('REPORT_REPOSITORY');
