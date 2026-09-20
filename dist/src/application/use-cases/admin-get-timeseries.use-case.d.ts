import { PrismaClient } from '@prisma/client';
export interface DayPoint {
    date: string;
    newUsers: number;
    newPings: number;
    newMessages: number;
}
/** Serie de los últimos 14 días, para los gráficos del dashboard.
 * Se agrega en JS en vez de SQL para mantenerlo simple — a esta escala
 * (piloto) trae todas las filas del rango y las agrupa por día. */
export declare class AdminGetTimeseriesUseCase {
    private readonly prisma;
    constructor(prisma: PrismaClient);
    execute(): Promise<DayPoint[]>;
}
