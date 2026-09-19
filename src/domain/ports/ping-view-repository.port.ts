export interface PingViewRepositoryPort {
  /** Idempotente: si ya existía la vista de este usuario, no hace nada. */
  recordView(pingId: string, viewerId: string): Promise<void>;
  countViews(pingId: string): Promise<number>;
}

export const PING_VIEW_REPOSITORY = Symbol('PING_VIEW_REPOSITORY');
