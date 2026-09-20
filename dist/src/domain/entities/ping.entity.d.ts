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
export declare class Ping {
    private props;
    private constructor();
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
    }): Ping;
    static reconstitute(props: PingProps): Ping;
    get id(): string;
    get authorId(): string;
    get message(): string;
    get imageUrl(): string | undefined;
    get color(): string | undefined;
    get location(): GeoPoint;
    get radiusMeters(): number;
    get isSocial(): boolean;
    get maxRecipients(): number;
    get deliveredCount(): number;
    get createdAt(): Date;
    get expiresAt(): Date;
    get status(): PingStatus;
    isActive(now: Date): boolean;
    hasReachedRecipientLimit(): boolean;
    /** Cuántos destinatarios más puede notificar este ping ahora mismo. */
    remainingCapacity(): number;
    registerDeliveries(count: number): void;
    toProps(): Readonly<PingProps>;
}
