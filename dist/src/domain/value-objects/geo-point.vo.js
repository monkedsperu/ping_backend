"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeoPoint = void 0;
/**
 * Value object inmutable que representa un punto geográfico.
 * No depende de ninguna librería externa ni de PostGIS: la capa de dominio
 * no debe saber cómo se persisten ni calculan las distancias en producción.
 */
class GeoPoint {
    constructor(latitude, longitude) {
        this.latitude = latitude;
        this.longitude = longitude;
    }
    static create(latitude, longitude) {
        if (latitude < -90 || latitude > 90) {
            throw new Error(`Latitud fuera de rango: ${latitude}`);
        }
        if (longitude < -180 || longitude > 180) {
            throw new Error(`Longitud fuera de rango: ${longitude}`);
        }
        return new GeoPoint(latitude, longitude);
    }
    /**
     * Distancia en metros usando la fórmula de haversine.
     * Se usa para validaciones en memoria (tests, reglas de negocio);
     * las búsquedas masivas en base de datos usan PostGIS por rendimiento.
     */
    distanceInMetersTo(other) {
        const EARTH_RADIUS_METERS = 6371000;
        const toRad = (deg) => (deg * Math.PI) / 180;
        const dLat = toRad(other.latitude - this.latitude);
        const dLon = toRad(other.longitude - this.longitude);
        const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(toRad(this.latitude)) *
                Math.cos(toRad(other.latitude)) *
                Math.sin(dLon / 2) ** 2;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return EARTH_RADIUS_METERS * c;
    }
}
exports.GeoPoint = GeoPoint;
