"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var CreatePingUseCase_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePingUseCase = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const ping_entity_1 = require("../../domain/entities/ping.entity");
const geo_point_vo_1 = require("../../domain/value-objects/geo-point.vo");
const ping_repository_port_1 = require("../../domain/ports/ping-repository.port");
const user_locator_port_1 = require("../../domain/ports/user-locator.port");
const notification_port_1 = require("../../domain/ports/notification.port");
const user_repository_port_1 = require("../../domain/ports/user-repository.port");
const settings_repository_port_1 = require("../../domain/ports/settings-repository.port");
const role_limits_defaults_1 = require("../../domain/entities/role-limits.defaults");
/**
 * Caso de uso de aplicación. Solo conoce interfaces (ports), inyectadas por
 * NestJS. Esto es lo que permite testearlo con dobles de prueba (ver
 * test/application/create-ping.use-case.spec.ts) sin levantar Postgres
 * ni Firebase, y reemplazar cualquier adaptador sin tocar esta clase.
 */
let CreatePingUseCase = CreatePingUseCase_1 = class CreatePingUseCase {
    constructor(pingRepository, userLocator, notifier, userRepository, settingsRepository) {
        this.pingRepository = pingRepository;
        this.userLocator = userLocator;
        this.notifier = notifier;
        this.userRepository = userRepository;
        this.settingsRepository = settingsRepository;
        this.logger = new common_1.Logger(CreatePingUseCase_1.name);
    }
    async execute(dto, authorId) {
        const location = geo_point_vo_1.GeoPoint.create(dto.latitude, dto.longitude);
        const author = await this.userRepository.findById(authorId);
        const role = author?.role ?? 'user';
        const [roleLimits, messageLimits] = await Promise.all([
            this.settingsRepository.getRoleLimits(role),
            this.settingsRepository.getMessageLimits(),
        ]);
        // Un anuncio social usa el rango extendido de PRODUCTO (fijo, no
        // configurable), sin importar qué tenga configurado el rol del autor
        // — así, aunque un admin achique el rango de "user", reportar algo
        // como una persona perdida sigue funcionando igual.
        const allowedRadii = dto.isSocial ? role_limits_defaults_1.SOCIAL_PING_RADII : roleLimits.allowedPingRadii;
        const ping = ping_entity_1.Ping.create({
            id: (0, crypto_1.randomUUID)(),
            authorId,
            message: dto.message,
            imageUrl: dto.imageUrl,
            color: dto.color,
            location,
            radiusMeters: dto.radiusMeters,
            durationMinutes: dto.durationMinutes,
            isSocial: dto.isSocial,
            now: new Date(),
            allowedRadii,
            allowedDurations: roleLimits.allowedDurations,
            minMessageLength: messageLimits.minMessageLength,
            maxMessageLength: messageLimits.maxMessageLength,
        });
        await this.pingRepository.save(ping);
        const nearbyUsers = await this.userLocator.findUsersCollidingWithPing(location, ping.radiusMeters, ping.authorId);
        const usersToNotify = nearbyUsers.slice(0, ping.remainingCapacity());
        let notifiedCount = 0;
        if (usersToNotify.length > 0) {
            try {
                await this.notifier.sendBatch(usersToNotify.map((user) => ({
                    pushToken: user.pushToken,
                    title: 'al toque',
                    body: ping.message,
                    data: { pingId: ping.id, type: 'nuevo_ping' },
                })));
                notifiedCount = usersToNotify.length;
                ping.registerDeliveries(notifiedCount);
                await this.pingRepository.save(ping);
            }
            catch (err) {
                // El ping ya existe y es válido aunque las notificaciones fallen
                // (por ejemplo, Firebase sin configurar). Un problema de entrega
                // no debe impedir que el ping se cree.
                this.logger.warn(`No se pudieron enviar notificaciones para el ping ${ping.id}: ${err instanceof Error ? err.message : err}`);
            }
        }
        return { ping, notifiedCount };
    }
};
exports.CreatePingUseCase = CreatePingUseCase;
exports.CreatePingUseCase = CreatePingUseCase = CreatePingUseCase_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(ping_repository_port_1.PING_REPOSITORY)),
    __param(1, (0, common_1.Inject)(user_locator_port_1.USER_LOCATOR)),
    __param(2, (0, common_1.Inject)(notification_port_1.NOTIFICATION_SENDER)),
    __param(3, (0, common_1.Inject)(user_repository_port_1.USER_REPOSITORY)),
    __param(4, (0, common_1.Inject)(settings_repository_port_1.SETTINGS_REPOSITORY)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object])
], CreatePingUseCase);
