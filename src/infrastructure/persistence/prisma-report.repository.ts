import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import {
  ReportRecord,
  ReportRepositoryPort,
  ReportStatus,
} from '../../domain/ports/report-repository.port';

@Injectable()
export class PrismaReportRepository implements ReportRepositoryPort {
  constructor(private readonly prisma: PrismaClient) {}

  async create(input: {
    id: string;
    reporterId: string;
    reportedUserId: string;
    pingId?: string;
    reason: string;
    now: Date;
  }): Promise<ReportRecord> {
    const row = await this.prisma.report.create({
      data: {
        id: input.id,
        reporterId: input.reporterId,
        reportedUserId: input.reportedUserId,
        pingId: input.pingId ?? null,
        reason: input.reason,
        createdAt: input.now,
      },
    });
    return this.toDomain(row);
  }

  async findAll(status?: ReportStatus): Promise<ReportRecord[]> {
    const rows = await this.prisma.report.findMany({
      where: status ? { status } : undefined,
      orderBy: { createdAt: 'desc' },
    });
    return rows.map((row) => this.toDomain(row));
  }

  async findById(id: string): Promise<ReportRecord | null> {
    const row = await this.prisma.report.findUnique({ where: { id } });
    return row ? this.toDomain(row) : null;
  }

  async updateStatus(
    id: string,
    status: ReportStatus,
    reviewedById: string,
    now: Date,
  ): Promise<void> {
    await this.prisma.report.update({
      where: { id },
      data: { status, reviewedById, reviewedAt: now },
    });
  }

  private toDomain(row: {
    id: string;
    reporterId: string;
    reportedUserId: string;
    pingId: string | null;
    reason: string;
    status: string;
    createdAt: Date;
    reviewedAt: Date | null;
    reviewedById: string | null;
  }): ReportRecord {
    return {
      id: row.id,
      reporterId: row.reporterId,
      reportedUserId: row.reportedUserId,
      pingId: row.pingId ?? undefined,
      reason: row.reason,
      status: row.status as ReportStatus,
      createdAt: row.createdAt,
      reviewedAt: row.reviewedAt ?? undefined,
      reviewedById: row.reviewedById ?? undefined,
    };
  }
}
