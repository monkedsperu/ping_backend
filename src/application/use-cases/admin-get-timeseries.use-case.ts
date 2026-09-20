import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

export interface DayPoint {
  date: string; // "2026-09-20"
  newUsers: number;
  newPings: number;
  newMessages: number;
}

const DAYS = 14;

function dayKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/** Serie de los últimos 14 días, para los gráficos del dashboard.
 * Se agrega en JS en vez de SQL para mantenerlo simple — a esta escala
 * (piloto) trae todas las filas del rango y las agrupa por día. */
@Injectable()
export class AdminGetTimeseriesUseCase {
  constructor(private readonly prisma: PrismaClient) {}

  async execute(): Promise<DayPoint[]> {
    const since = new Date();
    since.setDate(since.getDate() - (DAYS - 1));
    since.setHours(0, 0, 0, 0);

    const [users, pings, messages] = await Promise.all([
      this.prisma.user.findMany({ where: { createdAt: { gte: since } }, select: { createdAt: true } }),
      this.prisma.ping.findMany({ where: { createdAt: { gte: since } }, select: { createdAt: true } }),
      this.prisma.threadMessage.findMany({
        where: { createdAt: { gte: since } },
        select: { createdAt: true },
      }),
    ]);

    const days: DayPoint[] = [];
    for (let i = 0; i < DAYS; i++) {
      const d = new Date(since);
      d.setDate(d.getDate() + i);
      const key = dayKey(d);
      days.push({
        date: key,
        newUsers: users.filter((u) => dayKey(u.createdAt) === key).length,
        newPings: pings.filter((p) => dayKey(p.createdAt) === key).length,
        newMessages: messages.filter((m) => dayKey(m.createdAt) === key).length,
      });
    }
    return days;
  }
}
