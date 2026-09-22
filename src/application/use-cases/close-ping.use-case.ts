import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PING_REPOSITORY, PingRepositoryPort } from '../../domain/ports/ping-repository.port';

@Injectable()
export class ClosePingUseCase {
  constructor(
    @Inject(PING_REPOSITORY) private readonly pingRepository: PingRepositoryPort,
  ) {}

  async execute(pingId: string, requesterId: string): Promise<void> {
    const ping = await this.pingRepository.findById(pingId);
    if (!ping) {
      throw new NotFoundException('El ping no existe.');
    }
    if (ping.authorId !== requesterId) {
      throw new ForbiddenException('Solo el autor puede marcar esto como finalizado.');
    }
    ping.close();
    await this.pingRepository.save(ping);
  }
}
