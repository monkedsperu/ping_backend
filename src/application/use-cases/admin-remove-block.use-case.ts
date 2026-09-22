import { Inject, Injectable } from '@nestjs/common';
import {
  USER_BLOCK_REPOSITORY,
  UserBlockRepositoryPort,
} from '../../domain/ports/user-block-repository.port';

/** El admin puede forzar un desbloqueo (ej. tras revisar una denuncia
 * infundada) — recibe los dos ids directamente, no un id de bloqueo. */
@Injectable()
export class AdminRemoveBlockUseCase {
  constructor(
    @Inject(USER_BLOCK_REPOSITORY) private readonly blockRepository: UserBlockRepositoryPort,
  ) {}

  async execute(blockerId: string, blockedId: string): Promise<void> {
    await this.blockRepository.unblock(blockerId, blockedId);
  }
}
