import { Inject, Injectable } from '@nestjs/common';
import {
  USER_BLOCK_REPOSITORY,
  UserBlockRepositoryPort,
} from '../../domain/ports/user-block-repository.port';
import { USER_REPOSITORY, UserRepositoryPort } from '../../domain/ports/user-repository.port';

export interface AdminBlockView {
  id: string;
  blockerId: string;
  blockerName: string;
  blockedId: string;
  blockedName: string;
  createdAt: Date;
}

@Injectable()
export class AdminListBlocksUseCase {
  constructor(
    @Inject(USER_BLOCK_REPOSITORY) private readonly blockRepository: UserBlockRepositoryPort,
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepositoryPort,
  ) {}

  async execute(): Promise<AdminBlockView[]> {
    const blocks = await this.blockRepository.findAll();
    return Promise.all(
      blocks.map(async (b) => {
        const [blocker, blocked] = await Promise.all([
          this.userRepository.findById(b.blockerId),
          this.userRepository.findById(b.blockedId),
        ]);
        return {
          id: b.id,
          blockerId: b.blockerId,
          blockerName: blocker?.displayName ?? 'Usuario',
          blockedId: b.blockedId,
          blockedName: blocked?.displayName ?? 'Usuario',
          createdAt: b.createdAt,
        };
      }),
    );
  }
}
