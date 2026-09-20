import { Ping } from '../entities/ping.entity';
import { GeoPoint } from '../value-objects/geo-point.vo';

/**
 * Puerto de salida (driven port). Cualquier mecanismo de persistencia
 * (Postgres+PostGIS hoy, otra cosa mañana) debe implementar esta interfaz.
 * El caso de uso nunca importa Prisma ni SQL directamente.
 */
export interface PingRepositoryPort {
  save(ping: Ping): Promise<void>;
  findById(id: string): Promise<Ping | null>;
  findByAuthorId(authorId: string): Promise<Ping[]>;

  /**
   * Devuelve pings activos cuyo círculo de alcance (su propio
   * radiusMeters) TOCA el círculo de escucha del usuario centrado en
   * `center` con radio `listeningRadiusMeters`. No es "pings a X metros
   * de mí" — es colisión de dos círculos, cada ping con el suyo propio.
   */
  findCollidingWithListeningArea(
    center: GeoPoint,
    listeningRadiusMeters: number,
  ): Promise<Ping[]>;

  /** Todos los pings, sin filtro geográfico — solo para el panel de admin. */
  findAll(): Promise<Ping[]>;
}

export const PING_REPOSITORY = Symbol('PING_REPOSITORY');
