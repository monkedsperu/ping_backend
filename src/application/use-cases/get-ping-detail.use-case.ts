import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  PING_REPOSITORY,
  PingRepositoryPort,
} from '../../domain/ports/ping-repository.port';

export interface PingDetailView {
  id: string;
  message: string;
  imageUrl?: string;
  color?: string;
  authorId: string;
  latitude: number;
  longitude: number;
  radiusMeters: number;
  createdAt: Date;
  expiresAt: Date;
  status: string;
  isOwnPing: boolean;
}

/**
 * viewerId puede ser null (alguien navegando sin sesión). En ese caso
 * isOwnPing siempre es false — nadie sin cuenta puede ser autor de nada.
 */
@Injectable()
export class GetPingDetailUseCase {
  constructor(
    @Inject(PING_REPOSITORY) private readonly pingRepository: PingRepositoryPort,
  ) {}

  async execute(pingId: string, viewerId: string | null): Promise<PingDetailView> {
    const ping = await this.pingRepository.findById(pingId);
    if (!ping) {
      throw new NotFoundException('El ping no existe.');
    }

    const p = ping.toProps();
    return {
      id: p.id,
      message: p.message,
      imageUrl: p.imageUrl,
      color: p.color,
      authorId: p.authorId,
      latitude: p.location.latitude,
      longitude: p.location.longitude,
      radiusMeters: p.radiusMeters,
      createdAt: p.createdAt,
      expiresAt: p.expiresAt,
      status: p.status,
      isOwnPing: viewerId !== null && p.authorId === viewerId,
    };
  }
}
