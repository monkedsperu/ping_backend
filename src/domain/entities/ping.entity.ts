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
  isSocial: boolean;
  maxRecipients: number;
  deliveredCount: number;
  createdAt: Date;
  expiresAt: Date;
  status: PingStatus;
}

const HEX_COLOR_PATTERN = /^#[0-9A-Fa-f]{6}$/;
const MVP_MAX_RECIPIENTS = 20;
const DEFAULT_RADIUS_METERS = 100;
const DEFAULT_DURATION_MINUTES = 60;

export class Ping {
  private constructor(private props: PingProps) {}

  /**
   * Los conjuntos permitidos (radios, duraciones, largo del mensaje) ya
   * NO están fijos acá — los trae el caso de uso desde la configuración
   * (ver settings-repository.port.ts), que a su vez depende del rol del
   * autor. Esta entidad solo valida que el resultado esté dentro de lo
   * que le pasaron, sin saber de dónde salió esa lista.
   */
  static create(input: {
    id: string;
    authorId: string;
    message: string;
    imageUrl?: string;
    color?: string;
    location: GeoPoint;
    radiusMeters?: number;
    durationMinutes?: number;
    isSocial?: boolean;
    now: Date;
    allowedRadii: number[];
    allowedDurations: number[];
    minMessageLength: number;
    maxMessageLength: number;
  }): Ping {
    const trimmed = input.message.trim();
    if (trimmed.length < input.minMessageLength) {
      throw new Error('El mensaje del ping es muy corto.');
    }
    if (trimmed.length > input.maxMessageLength) {
      throw new Error('El mensaje del ping excede el largo máximo.');
    }

    if (input.color !== undefined && !HEX_COLOR_PATTERN.test(input.color)) {
      throw new Error('El color debe ser un hex de 6 dígitos, ej. "#D85A30".');
    }

    const isSocial = input.isSocial ?? false;

    const radiusMeters = input.radiusMeters ?? DEFAULT_RADIUS_METERS;
    if (!input.allowedRadii.includes(radiusMeters)) {
      throw new Error(
        `Radio inválido: ${radiusMeters}. Debe ser uno de: ${input.allowedRadii.join(', ')}.`,
      );
    }

    const durationMinutes = input.durationMinutes ?? DEFAULT_DURATION_MINUTES;
    if (!input.allowedDurations.includes(durationMinutes)) {
      throw new Error(
        `Duración inválida: ${durationMinutes}. Debe ser una de: ${input.allowedDurations.join(', ')} minutos.`,
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
      isSocial,
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
  get isSocial() { return this.props.isSocial; }
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
