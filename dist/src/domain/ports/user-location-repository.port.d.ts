export interface UserLocationRepositoryPort {
    upsert(userId: string, pushToken: string, latitude: number, longitude: number, listeningRadiusMeters: number): Promise<void>;
}
export declare const USER_LOCATION_REPOSITORY: unique symbol;
