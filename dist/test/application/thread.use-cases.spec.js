"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const start_thread_use_case_1 = require("../../src/application/use-cases/start-thread.use-case");
const send_thread_message_use_case_1 = require("../../src/application/use-cases/send-thread-message.use-case");
const ping_entity_1 = require("../../src/domain/entities/ping.entity");
const geo_point_vo_1 = require("../../src/domain/value-objects/geo-point.vo");
const AUTHOR_ID = '11111111-1111-1111-1111-111111111111';
const RESPONDER_ID = '22222222-2222-2222-2222-222222222222';
const STRANGER_ID = '33333333-3333-3333-3333-333333333333';
function buildPing() {
    return ping_entity_1.Ping.create({
        id: 'ping-1',
        authorId: AUTHOR_ID,
        message: 'se perdió mi perro cerca del parque',
        location: geo_point_vo_1.GeoPoint.create(-12.09, -77.03),
        now: new Date(),
        allowedRadii: [50, 100, 200, 300, 400, 500],
        allowedDurations: [5, 15, 30, 60, 360, 1440],
        minMessageLength: 5,
        maxMessageLength: 280,
    });
}
class FakePingRepository {
    constructor(ping) {
        this.ping = ping;
    }
    async save() { }
    async findById() { return this.ping; }
    async findByAuthorId() { return []; }
    async findCollidingWithListeningArea() { return []; }
    async findAll() { return []; }
}
class FakeThreadRepository {
    constructor(existing = []) {
        this.threads = [];
        this.threads = existing;
    }
    async create(pingId, responderId) {
        const thread = { id: `thread-${this.threads.length + 1}`, pingId, responderId, createdAt: new Date() };
        this.threads.push(thread);
        return thread;
    }
    async findByPingAndResponder(pingId, responderId) {
        return this.threads.find((t) => t.pingId === pingId && t.responderId === responderId) ?? null;
    }
    async findById(threadId) {
        return this.threads.find((t) => t.id === threadId) ?? null;
    }
    async findByPingId(pingId) {
        return this.threads.filter((t) => t.pingId === pingId);
    }
    async findByResponderId(responderId) {
        return this.threads.filter((t) => t.responderId === responderId);
    }
}
class FakeMessageRepository {
    constructor() {
        this.saved = [];
    }
    async save(message) { this.saved.push(message); }
    async findByThreadId(threadId) { return this.saved.filter((m) => m.toProps().threadId === threadId); }
    async findLastByThreadId() { return this.saved[this.saved.length - 1] ?? null; }
}
describe('StartThreadUseCase', () => {
    it('rechaza que el autor inicie un hilo en su propio ping', async () => {
        const useCase = new start_thread_use_case_1.StartThreadUseCase(new FakePingRepository(buildPing()), new FakeThreadRepository(), new FakeMessageRepository());
        await expect(useCase.execute('ping-1', { message: 'lo vi cerca de mi casa' }, AUTHOR_ID)).rejects.toThrow('No puedes responder tu propio ping.');
    });
    it('rechaza abrir un segundo hilo si ya existe uno para ese respondiente', async () => {
        const threadRepository = new FakeThreadRepository([
            { id: 'thread-1', pingId: 'ping-1', responderId: RESPONDER_ID, createdAt: new Date() },
        ]);
        const useCase = new start_thread_use_case_1.StartThreadUseCase(new FakePingRepository(buildPing()), threadRepository, new FakeMessageRepository());
        await expect(useCase.execute('ping-1', { message: 'otra vez yo' }, RESPONDER_ID)).rejects.toThrow('Ya tienes una conversación abierta');
    });
});
describe('SendThreadMessageUseCase', () => {
    it('permite al autor y al respondiente escribirse mutuamente', async () => {
        const threadRepository = new FakeThreadRepository([
            { id: 'thread-1', pingId: 'ping-1', responderId: RESPONDER_ID, createdAt: new Date() },
        ]);
        const messageRepository = new FakeMessageRepository();
        const useCase = new send_thread_message_use_case_1.SendThreadMessageUseCase(new FakePingRepository(buildPing()), threadRepository, messageRepository);
        await useCase.execute('ping-1', RESPONDER_ID, { message: '¿qué collar tenía?' }, AUTHOR_ID);
        await useCase.execute('ping-1', RESPONDER_ID, { message: 'uno rojo' }, RESPONDER_ID);
        expect(messageRepository.saved).toHaveLength(2);
    });
    it('rechaza que un tercero ajeno escriba en el hilo', async () => {
        const threadRepository = new FakeThreadRepository([
            { id: 'thread-1', pingId: 'ping-1', responderId: RESPONDER_ID, createdAt: new Date() },
        ]);
        const useCase = new send_thread_message_use_case_1.SendThreadMessageUseCase(new FakePingRepository(buildPing()), threadRepository, new FakeMessageRepository());
        await expect(useCase.execute('ping-1', RESPONDER_ID, { message: 'yo también sé algo' }, STRANGER_ID)).rejects.toThrow('No formas parte de esta conversación.');
    });
});
