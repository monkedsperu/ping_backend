import { Inject, Injectable } from '@nestjs/common';
import {
  USER_BLOCK_REPOSITORY,
  UserBlockRepositoryPort,
} from '../../domain/ports/user-block-repository.port';

@Injectable()
export class UnblockUserUseCase {
  constructor(
    @Inject(USER_BLOCK_REPOSITORY) private readonly blockRepository: UserBlockRepositoryPort,
  ) {}

  async execute(blockerId: string, blockedId: string): Promise<void> {
    await this.blockRepository.unblock(blockerId, blockedId);
  }
}
