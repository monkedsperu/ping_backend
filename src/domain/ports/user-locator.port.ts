import { GeoPoint } from '../value-objects/geo-point.vo';

export interface NearbyUser {
  userId: string;
  pushToken: string;
  distanceMeters: number;
}

/**
 * A quién le "llega" un ping: no es "usuarios a X metros del ping" sino
 * usuarios cuyo círculo de escucha (su propia preferencia, guardada por
 * usuario) toca el círculo de alcance del ping. Por eso este puerto no
 * recibe un radio como parámetro — cada usuario tiene el suyo guardado.
 */
export interface UserLocatorPort {
  findUsersCollidingWithPing(
    pingCenter: GeoPoint,
    pingRadiusMeters: number,
    excludeUserId: string,
  ): Promise<NearbyUser[]>;
}

export const USER_LOCATOR = Symbol('USER_LOCATOR');
