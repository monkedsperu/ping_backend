import { Inject, Injectable } from '@nestjs/common';
import { USER_REPOSITORY, UserRepositoryPort } from '../../domain/ports/user-repository.port';

export interface AdminUserView {
  id: string;
  email: string;
  displayName: string;
  role: string;
  isDisabled: boolean;
  hasGoogle: boolean;
  createdAt: Date;
}

@Injectable()
export class AdminListUsersUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepositoryPort,
  ) {}

  async execute(): Promise<AdminUserView[]> {
    const users = await this.userRepository.findAll();
    return users.map((u) => ({
      id: u.id,
      email: u.email,
      displayName: u.displayName,
      role: u.role,
      isDisabled: u.isDisabled,
      hasGoogle: Boolean(u.googleId),
      createdAt: u.createdAt,
    }));
  }
}
