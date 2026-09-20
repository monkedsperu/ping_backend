import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { USER_REPOSITORY, UserRepositoryPort } from '../../domain/ports/user-repository.port';
import { UserRole } from '../../domain/entities/user.entity';

@Injectable()
export class AdminSetUserRoleUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepositoryPort,
  ) {}

  async execute(userId: string, role: UserRole): Promise<void> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado.');
    }
    user.setRole(role);
    await this.userRepository.save(user);
  }
}
