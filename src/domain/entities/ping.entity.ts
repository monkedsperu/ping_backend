import { GeoPoint } from '../value-objects/geo-point.vo';

export type PingStatus = 'active' | 'expired' | 'closed';

export interface PingProps {
  id: string;
  authorId: string;
  message: string;
  imageUrl?: string;
  color?: string;
  location: GeoPoint;
  radiusMeters: number;
  maxRecipients: number;
  deliveredCount: number;
  createdAt: Date;
  expiresAt: Date;
  status: PingStatus;
}

/**
 * Reglas del MVP: tope de destinatarios sigue fijo (sin planes pagos),
 * pero radio y duración ahora son elegibles dentro de conjuntos
 * cerrados de valores — no cualquier número.
 */
export const ALLOWED_RADIUS_METERS = [50, 100, 200, 300, 400, 500] as const;
export type AllowedRadiusMeters = (typeof ALLOWED_RADIUS_METERS)[number];
const DEFAULT_RADIUS_METERS: AllowedRadiusMeters = 100;

export const ALLOWED_DURATION_MINUTES = [5, 15, 30, 60, 360, 1440] as const; // 5/15/30min, 1h, 6h, 24h
export type AllowedDurationMinutes = (typeof ALLOWED_DURATION_MINUTES)[number];
const DEFAULT_DURATION_MINUTES: AllowedDurationMinutes = 60;

const HEX_COLOR_PATTERN = /^#[0-9A-Fa-f]{6}$/;
const MVP_MAX_RECIPIENTS = 20;
const MIN_MESSAGE_LENGTH = 5;
const MAX_MESSAGE_LENGTH = 280;

export class Ping {
  private constructor(private props: PingProps) {}

  static create(input: {
    id: string;
    authorId: string;
    message: string;
    imageUrl?: string;
    color?: string;
    location: GeoPoint;
    radiusMeters?: number;
    durationMinutes?: number;
    now: Date;
  }): Ping {
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
    if (!ALLOWED_RADIUS_METERS.includes(radiusMeters as AllowedRadiusMeters)) {
      throw new Error(
        `Radio inválido: ${radiusMeters}. Debe ser uno de: ${ALLOWED_RADIUS_METERS.join(', ')}.`,
      );
    }

    const durationMinutes = input.durationMinutes ?? DEFAULT_DURATION_MINUTES;
    if (!ALLOWED_DURATION_MINUTES.includes(durationMinutes as AllowedDurationMinutes)) {
      throw new Error(
        `Duración inválida: ${durationMinutes}. Debe ser una de: ${ALLOWED_DURATION_MINUTES.join(', ')} minutos.`,
      );
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

  static reconstitute(props: PingProps): Ping {
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

  isActive(now: Date): boolean {
    return this.props.status === 'active' && now < this.props.expiresAt;
  }

  hasReachedRecipientLimit(): boolean {
    return this.props.deliveredCount >= this.props.maxRecipients;
  }

  /** Cuántos destinatarios más puede notificar este ping ahora mismo. */
  remainingCapacity(): number {
    return Math.max(0, this.props.maxRecipients - this.props.deliveredCount);
  }

  registerDeliveries(count: number): void {
    this.props.deliveredCount = Math.min(
      this.props.maxRecipients,
      this.props.deliveredCount + count,
    );
  }

  toProps(): Readonly<PingProps> {
    return { ...this.props };
  }
}
