"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ping = exports.ALLOWED_DURATION_MINUTES = exports.ALLOWED_RADIUS_METERS = void 0;
/**
 * Reglas del MVP: tope de destinatarios sigue fijo (sin planes pagos),
 * pero radio y duración ahora son elegibles dentro de conjuntos
 * cerrados de valores — no cualquier número.
 */
exports.ALLOWED_RADIUS_METERS = [50, 100, 200, 300, 400, 500];
const DEFAULT_RADIUS_METERS = 100;
exports.ALLOWED_DURATION_MINUTES = [5, 15, 30, 60, 360, 1440]; // 5/15/30min, 1h, 6h, 24h
const DEFAULT_DURATION_MINUTES = 60;
const HEX_COLOR_PATTERN = /^#[0-9A-Fa-f]{6}$/;
const MVP_MAX_RECIPIENTS = 20;
const MIN_MESSAGE_LENGTH = 5;
const MAX_MESSAGE_LENGTH = 280;
class Ping {
    constructor(props) {
        this.props = props;
    }
    static create(input) {
        const trimmed = input.message.trim();
        if (trimmed.length < MIN_MESSAGE_LENGTH) {
            throw new Error('El mensaje del ping es muy corto.');
        }
        if (trimmed.length > MAX_MESSAGE_LENGTH) {
            throw new Error('El mensaje del ping excede el largo máximo.');
        }
        if (input.color !== undefined && !HEX_COLOR_PATTERN.test(input.color)) {
            throw new Error('El color debe ser un hex de 6 dígitos, ej. "#D85A30".');
        }
        const radiusMeters = input.radiusMeters ?? DEFAULT_RADIUS_METERS;
        if (!exports.ALLOWED_RADIUS_METERS.includes(radiusMeters)) {
            throw new Error(`Radio inválido: ${radiusMeters}. Debe ser uno de: ${exports.ALLOWED_RADIUS_METERS.join(', ')}.`);
        }
        const durationMinutes = input.durationMinutes ?? DEFAULT_DURATION_MINUTES;
        if (!exports.ALLOWED_DURATION_MINUTES.includes(durationMinutes)) {
            throw new Error(`Duración inválida: ${durationMinutes}. Debe ser una de: ${exports.ALLOWED_DURATION_MINUTES.join(', ')} minutos.`);
        }
        const expiresAt = new Date(input.now.getTime() + durationMinutes * 60_000);
        return new Ping({
            id: input.id,
            authorId: input.authorId,
            message: trimmed,
            imageUrl: input.imageUrl,
            color: input.color,
            location: input.location,
            radiusMeters,
            maxRecipients: MVP_MAX_RECIPIENTS,
            deliveredCount: 0,
            createdAt: input.now,
            expiresAt,
            status: 'active',
        });
    }
    static reconstitute(props) {
        return new Ping(props);
    }
    get id() { return this.props.id; }
    get authorId() { return this.props.authorId; }
    get message() { return this.props.message; }
    get imageUrl() { return this.props.imageUrl; }
    get color() { return this.props.color; }
    get location() { return this.props.location; }
    get radiusMeters() { return this.props.radiusMeters; }
    get maxRecipients() { return this.props.maxRecipients; }
    get deliveredCount() { return this.props.deliveredCount; }
    get createdAt() { return this.props.createdAt; }
    get expiresAt() { return this.props.expiresAt; }
    get status() { return this.props.status; }
    isActive(now) {
        return this.props.status === 'active' && now < this.props.expiresAt;
    }
    hasReachedRecipientLimit() {
        return this.props.deliveredCount >= this.props.maxRecipients;
    }
    /** Cuántos destinatarios más puede notificar este ping ahora mismo. */
    remainingCapacity() {
        return Math.max(0, this.props.maxRecipients - this.props.deliveredCount);
    }
    registerDeliveries(count) {
        this.props.deliveredCount = Math.min(this.props.maxRecipients, this.props.deliveredCount + count);
    }
    toProps() {
        return { ...this.props };
    }
}
exports.Ping = Ping;
