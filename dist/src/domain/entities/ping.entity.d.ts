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
export declare const ALLOWED_RADIUS_METERS: readonly [50, 100, 200, 300, 400, 500];
export type AllowedRadiusMeters = (typeof ALLOWED_RADIUS_METERS)[number];
export declare const ALLOWED_DURATION_MINUTES: readonly [5, 15, 30, 60, 360, 1440];
export type AllowedDurationMinutes = (typeof ALLOWED_DURATION_MINUTES)[number];
export declare class Ping {
    private props;
    private constructor();
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
    }): Ping;
    static reconstitute(props: PingProps): Ping;
    get id(): string;
    get authorId(): string;
    get message(): string;
    get imageUrl(): string | undefined;
    get color(): string | undefined;
    get location(): GeoPoint;
    get radiusMeters(): number;
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
