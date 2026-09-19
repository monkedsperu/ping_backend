export interface UserLocationRepositoryPort {
  upsert(
    userId: string,
    pushToken: string,
    latitude: number,
    longitude: number,
    listeningRadiusMeters: number,
  ): Promise<void>;
}

export const USER_LOCATION_REPOSITORY = Symbol('USER_LOCATION_REPOSITORY');
