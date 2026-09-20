export declare class GetNearbyPingsDto {
    latitude: number;
    longitude: number;
    /** Tu radio de escucha ahora mismo — ver Ping.findCollidingWithListeningArea.
     * El conjunto exacto permitido según el rol vive en GetNearbyPingsUseCase. */
    listeningRadiusMeters: number;
}
