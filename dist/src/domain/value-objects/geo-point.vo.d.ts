/**
 * Value object inmutable que representa un punto geográfico.
 * No depende de ninguna librería externa ni de PostGIS: la capa de dominio
 * no debe saber cómo se persisten ni calculan las distancias en producción.
 */
export declare class GeoPoint {
    readonly latitude: number;
    readonly longitude: number;
    private constructor();
    static create(latitude: number, longitude: number): GeoPoint;
    /**
     * Distancia en metros usando la fórmula de haversine.
     * Se usa para validaciones en memoria (tests, reglas de negocio);
     * las búsquedas masivas en base de datos usan PostGIS por rendimiento.
     */
    distanceInMetersTo(other: GeoPoint): number;
}
