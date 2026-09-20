import { CreatePingUseCase } from '../../src/application/use-cases/create-ping.use-case';
import { PingRepositoryPort } from '../../src/domain/ports/ping-repository.port';
import { UserLocatorPort, NearbyUser } from '../../src/domain/ports/user-locator.port';
import { NotificationPort, PushNotification } from '../../src/domain/ports/notification.port';
import { UserRepositoryPort } from '../../src/domain/ports/user-repository.port';
import { SettingsRepositoryPort } from '../../src/domain/ports/settings-repository.port';
import { DEFAULT_ROLE_LIMITS, DEFAULT_MESSAGE_LIMITS } from '../../src/domain/entities/role-limits.defaults';
import { Ping } from '../../src/domain/entities/ping.entity';

/**
 * Fakes en memoria. Como los casos de uso solo dependen de interfaces
 * (ports), no necesitamos Postgres ni Firebase reales para probar la
 * lógica de negocio: esa es la ganancia práctica del bajo acoplamiento.
 */
class FakePingRepository implements PingRepositoryPort {
  public saved: Ping[] = [];
  async save(ping: Ping) { this.saved.push(ping); }
  async findById() { return null; }
  async findByAuthorId() { return []; }
  async findCollidingWithListeningArea() { return []; }
  async findAll() { return []; }
}

class FakeUserLocator implements UserLocatorPort {
  constructor(private readonly users: NearbyUser[]) {}
  async findUsersCollidingWithPing() { return this.users; }
}

class FakeNotifier implements NotificationPort {
  public sent: PushNotification[] = [];
  async sendBatch(notifications: PushNotification[]) {
    this.sent.push(...notifications);
  }
}

/** Rol 'user' por defecto — el 500m normal alcanza para estos tests. */
class FakeUserRepository implements UserRepositoryPort {
  async save() {}
  async findByEmail() { return null; }
  async findById() { return null; }
  async findByGoogleId() { return null; }
  async findAll() { return []; }
  async upsertGoogleAccount(): Promise<any> {
    throw new Error('no usado en estos tests');
  }
}

/** Devuelve los mismos valores por defecto que usa el sistema real
 * cuando el admin nunca configuró nada — así el test sigue probando el
 * comportamiento "de fábrica". */
class FakeSettingsRepository implements SettingsRepositoryPort {
  async getRoleLimits(role: 'user' | 'premium' | 'mod' | 'admin') {
    return DEFAULT_ROLE_LIMITS[role];
  }
  async getAllRoleLimits() {
    return Object.values(DEFAULT_ROLE_LIMITS);
  }
  async saveRoleLimits() {}
  async getMessageLimits() {
    return DEFAULT_MESSAGE_LIMITS;
  }
  async saveMessageLimits() {}
}

describe('CreatePingUseCase', () => {
  it('crea el ping y notifica solo hasta el límite de destinatarios', async () => {
    const manyUsers: NearbyUser[] = Array.from({ length: 25 }, (_, i) => ({
      userId: `user-${i}`,
      pushToken: `token-${i}`,
      distanceMeters: i,
    }));

    const pingRepository = new FakePingRepository();
    const notifier = new FakeNotifier();
    const useCase = new CreatePingUseCase(
      pingRepository,
      new FakeUserLocator(manyUsers),
      notifier,
      new FakeUserRepository(),
      new FakeSettingsRepository(),
    );

    const result = await useCase.execute(
      {
        message: 'se perdió mi perro cerca del parque',
        latitude: -12.09,
        longitude: -77.03,
      },
      '11111111-1111-1111-1111-111111111111',
    );

    expect(pingRepository.saved.length).toBeGreaterThan(0);
    expect(result.notifiedCount).toBe(20); // tope del MVP, no 25
    expect(notifier.sent).toHaveLength(20);
  });

  it('rechaza mensajes demasiado cortos antes de tocar cualquier adaptador', async () => {
    const useCase = new CreatePingUseCase(
      new FakePingRepository(),
      new FakeUserLocator([]),
      new FakeNotifier(),
      new FakeUserRepository(),
      new FakeSettingsRepository(),
    );

    await expect(
      useCase.execute(
        { message: 'hi', latitude: -12.09, longitude: -77.03 },
        '11111111-1111-1111-1111-111111111111',
      ),
    ).rejects.toThrow('muy corto');
  });
});
