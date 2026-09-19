export interface PingThreadSummary {
  id: string;
  pingId: string;
  responderId: string;
  createdAt: Date;
}

export interface PingThreadRepositoryPort {
  create(pingId: string, responderId: string): Promise<PingThreadSummary>;
  findByPingAndResponder(pingId: string, responderId: string): Promise<PingThreadSummary | null>;
  findById(threadId: string): Promise<PingThreadSummary | null>;
  findByPingId(pingId: string): Promise<PingThreadSummary[]>;
  /** Todos los hilos donde este usuario es quien RESPONDIÓ, sin importar el ping. */
  findByResponderId(responderId: string): Promise<PingThreadSummary[]>;
}

export const PING_THREAD_REPOSITORY = Symbol('PING_THREAD_REPOSITORY');
