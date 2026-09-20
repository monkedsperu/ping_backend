import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { USER_REPOSITORY, UserRepositoryPort } from '../../domain/ports/user-repository.port';

@Injectable()
export class AdminSetUserDisabledUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepositoryPort,
  ) {}

  async execute(userId: string, disabled: boolean): Promise<void> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado.');
    }
    if (disabled) {
      user.disable();
    } else {
      user.enable();
    }
    await this.userRepository.save(user);
  }
}
