import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { USER_REPOSITORY, UserRepositoryPort } from '../../domain/ports/user-repository.port';
import { UpdateDisplayNameDto } from '../dto/update-display-name.dto';

@Injectable()
export class UpdateDisplayNameUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepositoryPort,
  ) {}

  async execute(userId: string, dto: UpdateDisplayNameDto): Promise<{ displayName: string }> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado.');
    }
    user.renameTo(dto.displayName);
    await this.userRepository.save(user);
    return { displayName: user.displayName };
  }
}
