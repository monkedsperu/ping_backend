import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'crypto';
import * as bcrypt from 'bcryptjs';
import { User } from '../../domain/entities/user.entity';
import { USER_REPOSITORY, UserRepositoryPort } from '../../domain/ports/user-repository.port';
import { RegisterDto } from '../dto/auth.dto';

const SALT_ROUNDS = 10;

export interface AuthResult {
  accessToken: string;
  userId: string;
  displayName: string;
}

@Injectable()
export class RegisterUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepositoryPort,
    private readonly jwtService: JwtService,
  ) {}

  async execute(dto: RegisterDto): Promise<AuthResult> {
    const existing = await this.userRepository.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('Ya existe una cuenta con ese correo.');
    }

    const passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);
    const user = User.create({
      id: randomUUID(),
      email: dto.email,
      passwordHash,
      displayName: dto.displayName,
      now: new Date(),
    });

    await this.userRepository.save(user);

    const accessToken = await this.jwtService.signAsync({ sub: user.id, email: user.email });
    return { accessToken, userId: user.id, displayName: user.displayName };
  }
}
