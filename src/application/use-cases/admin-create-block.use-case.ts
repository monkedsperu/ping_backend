import { Inject, Injectable } from '@nestjs/common';
import {
  USER_BLOCK_REPOSITORY,
  UserBlockRepositoryPort,
} from '../../domain/ports/user-block-repository.port';

/** El admin puede forzar un bloqueo en nombre de un usuario — típicamente
 * al revisar una denuncia, para proteger a quien denunció sin que tenga
 * que hacerlo él mismo desde la app. */
@Injectable()
export class AdminCreateBlockUseCase {
  constructor(
    @Inject(USER_BLOCK_REPOSITORY) private readonly blockRepository: UserBlockRepositoryPort,
  ) {}

  async execute(blockerId: string, blockedId: string): Promise<void> {
    await this.blockRepository.block(blockerId, blockedId, new Date());
  }
}
