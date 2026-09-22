import { Inject, Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Ping, DEFAULT_CATEGORY_KEY } from '../../domain/entities/ping.entity';
import { GeoPoint } from '../../domain/value-objects/geo-point.vo';
import {
  PING_REPOSITORY,
  PingRepositoryPort,
} from '../../domain/ports/ping-repository.port';
import {
  USER_LOCATOR,
  UserLocatorPort,
} from '../../domain/ports/user-locator.port';
import {
  NOTIFICATION_SENDER,
  NotificationPort,
} from '../../domain/ports/notification.port';
import { USER_REPOSITORY, UserRepositoryPort } from '../../domain/ports/user-repository.port';
import {
  SETTINGS_REPOSITORY,
  SettingsRepositoryPort,
} from '../../domain/ports/settings-repository.port';
import { SOCIAL_PING_RADII, SOCIAL_DURATIONS } from '../../domain/entities/role-limits.defaults';
import { CreatePingDto } from '../dto/create-ping.dto';

export interface CreatePingResult {
  ping: Ping;
  notifiedCount: number;
}

/**
 * Caso de uso de aplicación. Solo conoce interfaces (ports), inyectadas por
 * NestJS. Esto es lo que permite testearlo con dobles de prueba (ver
 * test/application/create-ping.use-case.spec.ts) sin levantar Postgres
 * ni Firebase, y reemplazar cualquier adaptador sin tocar esta clase.
 */
@Injectable()
export class CreatePingUseCase {
  private readonly logger = new Logger(CreatePingUseCase.name);

  constructor(
    @Inject(PING_REPOSITORY) private readonly pingRepository: PingRepositoryPort,
    @Inject(USER_LOCATOR) private readonly userLocator: UserLocatorPort,
    @Inject(NOTIFICATION_SENDER) private readonly notifier: NotificationPort,
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepositoryPort,
    @Inject(SETTINGS_REPOSITORY) private readonly settingsRepository: SettingsRepositoryPort,
  ) {}

  async execute(dto: CreatePingDto, authorId: string): Promise<CreatePingResult> {
    const location = GeoPoint.create(dto.latitude, dto.longitude);
    const author = await this.userRepository.findById(authorId);
    const role = author?.role ?? 'user';

    const [roleLimits, messageLimits, activeCategories] = await Promise.all([
      this.settingsRepository.getRoleLimits(role),
      this.settingsRepository.getMessageLimits(),
      this.settingsRepository.getActiveCategories(),
    ]);

    // Si mandan una categoría que no existe o está desactivada, no
    // reventamos la creación del ping por eso — caemos a la categoría
    // por defecto en silencio (puede pasar si el admin la desactivó
    // justo mientras alguien tenía el formulario abierto).
    const categoryKey =
      dto.categoryKey && activeCategories.some((c) => c.key === dto.categoryKey)
        ? dto.categoryKey
        : DEFAULT_CATEGORY_KEY;

    // Un anuncio social usa el rango extendido de PRODUCTO (fijo, no
    // configurable), sin importar qué tenga configurado el rol del autor
    // — así, aunque un admin achique el rango de "user", reportar algo
    // como una persona perdida sigue funcionando igual.
    const allowedRadii = dto.isSocial ? SOCIAL_PING_RADII : roleLimits.allowedPingRadii;
    const allowedDurations = dto.isSocial ? SOCIAL_DURATIONS : roleLimits.allowedDurations;

    const ping = Ping.create({
      id: randomUUID(),
      authorId,
      message: dto.message,
      imageUrl: dto.imageUrl,
      color: dto.color,
      location,
      radiusMeters: dto.radiusMeters,
      durationMinutes: dto.durationMinutes,
      isSocial: dto.isSocial,
      categoryKey,
      now: new Date(),
      allowedRadii,
      allowedDurations,
      minMessageLength: messageLimits.minMessageLength,
      maxMessageLength: messageLimits.maxMessageLength,
    });

    await this.pingRepository.save(ping);

    const nearbyUsers = await this.userLocator.findUsersCollidingWithPing(
      location,
      ping.radiusMeters,
      ping.authorId,
    );

    const usersToNotify = nearbyUsers.slice(0, ping.remainingCapacity());
    let notifiedCount = 0;

    if (usersToNotify.length > 0) {
      try {
        await this.notifier.sendBatch(
          usersToNotify.map((user) => ({
            pushToken: user.pushToken,
            title: 'al toque',
            body: ping.message,
            data: { pingId: ping.id, type: 'nuevo_ping' },
          })),
        );
        notifiedCount = usersToNotify.length;
        ping.registerDeliveries(notifiedCount);
        await this.pingRepository.save(ping);
      } catch (err) {
        // El ping ya existe y es válido aunque las notificaciones fallen
        // (por ejemplo, Firebase sin configurar). Un problema de entrega
        // no debe impedir que el ping se cree.
        this.logger.warn(
          `No se pudieron enviar notificaciones para el ping ${ping.id}: ${
            err instanceof Error ? err.message : err
          }`,
        );
      }
    }

    return { ping, notifiedCount };
  }
}
