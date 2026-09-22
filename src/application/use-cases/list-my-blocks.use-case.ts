import { Inject, Injectable } from '@nestjs/common';
import {
  USER_BLOCK_REPOSITORY,
  UserBlockRepositoryPort,
} from '../../domain/ports/user-block-repository.port';
import { USER_REPOSITORY, UserRepositoryPort } from '../../domain/ports/user-repository.port';

export interface MyBlockView {
  userId: string;
  displayName: string;
  blockedAt: Date;
}

@Injectable()
export class ListMyBlocksUseCase {
  constructor(
    @Inject(USER_BLOCK_REPOSITORY) private readonly blockRepository: UserBlockRepositoryPort,
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepositoryPort,
  ) {}

  async execute(userId: string): Promise<MyBlockView[]> {
    const blocks = await this.blockRepository.findMyBlocks(userId);
    return Promise.all(
      blocks.map(async (b) => {
        const user = await this.userRepository.findById(b.blockedId);
        return {
          userId: b.blockedId,
          displayName: user?.displayName ?? 'Usuario',
          blockedAt: b.createdAt,
        };
      }),
    );
  }
}
