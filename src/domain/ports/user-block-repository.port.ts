export interface UserBlockRecord {
  id: string;
  blockerId: string;
  blockedId: string;
  createdAt: Date;
}

export interface UserBlockRepositoryPort {
  block(blockerId: string, blockedId: string, now: Date): Promise<void>;
  unblock(blockerId: string, blockedId: string): Promise<void>;
  /** true si CUALQUIERA de los dos bloqueó al otro — el bloqueo es
   * mutuo en sus efectos (ninguno ve al otro), aunque solo uno lo haya
   * iniciado. */
  isBlockedEitherWay(userIdA: string, userIdB: string): Promise<boolean>;
  /** Todos los ids que ESTE usuario bloqueó (no los que lo bloquearon a
   * él) — para el feed: además hay que excluir por el otro sentido,
   * pero eso se resuelve por-ping en isBlockedEitherWay, ya que el feed
   * necesita saberlo por cada autor distinto. */
  findBlockedIdsByUser(userId: string): Promise<string[]>;
  findMyBlocks(userId: string): Promise<UserBlockRecord[]>;
  findAll(): Promise<UserBlockRecord[]>;
}

export const USER_BLOCK_REPOSITORY = Symbol('USER_BLOCK_REPOSITORY');
