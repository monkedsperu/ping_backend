"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const create_ping_use_case_1 = require("../../src/application/use-cases/create-ping.use-case");
/**
 * Fakes en memoria. Como los casos de uso solo dependen de interfaces
 * (ports), no necesitamos Postgres ni Firebase reales para probar la
 * lógica de negocio: esa es la ganancia práctica del bajo acoplamiento.
 */
class FakePingRepository {
    constructor() {
        this.saved = [];
    }
    async save(ping) { this.saved.push(ping); }
    async findById() { return null; }
    async findByAuthorId() { return []; }
    async findCollidingWithListeningArea() { return []; }
}
class FakeUserLocator {
    constructor(users) {
        this.users = users;
    }
    async findUsersCollidingWithPing() { return this.users; }
}
class FakeNotifier {
    constructor() {
        this.sent = [];
    }
    async sendBatch(notifications) {
        this.sent.push(...notifications);
    }
}
describe('CreatePingUseCase', () => {
    it('crea el ping y notifica solo hasta el límite de destinatarios', async () => {
        const manyUsers = Array.from({ length: 25 }, (_, i) => ({
            userId: `user-${i}`,
            pushToken: `token-${i}`,
            distanceMeters: i,
        }));
        const pingRepository = new FakePingRepository();
        const notifier = new FakeNotifier();
        const useCase = new create_ping_use_case_1.CreatePingUseCase(pingRepository, new FakeUserLocator(manyUsers), notifier);
        const result = await useCase.execute({
            message: 'se perdió mi perro cerca del parque',
            latitude: -12.09,
            longitude: -77.03,
        }, '11111111-1111-1111-1111-111111111111');
        expect(pingRepository.saved.length).toBeGreaterThan(0);
        expect(result.notifiedCount).toBe(20); // tope del MVP, no 25
        expect(notifier.sent).toHaveLength(20);
    });
    it('rechaza mensajes demasiado cortos antes de tocar cualquier adaptador', async () => {
        const useCase = new create_ping_use_case_1.CreatePingUseCase(new FakePingRepository(), new FakeUserLocator([]), new FakeNotifier());
        await expect(useCase.execute({ message: 'hi', latitude: -12.09, longitude: -77.03 }, '11111111-1111-1111-1111-111111111111')).rejects.toThrow('muy corto');
    });
});
