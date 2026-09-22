import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import {
  USER_BLOCK_REPOSITORY,
  UserBlockRepositoryPort,
} from '../../domain/ports/user-block-repository.port';

@Injectable()
export class BlockUserUseCase {
  constructor(
    @Inject(USER_BLOCK_REPOSITORY) private readonly blockRepository: UserBlockRepositoryPort,
  ) {}

  async execute(blockerId: string, blockedId: string): Promise<void> {
    if (blockerId === blockedId) {
      throw new BadRequestException('No puedes bloquearte a ti mismo.');
    }
    await this.blockRepository.block(blockerId, blockedId, new Date());
  }
}
