export declare const ALLOWED_LISTENING_RADIUS_METERS: readonly [100, 200, 500, 1000, 2000];
export declare class ReportLocationDto {
    pushToken: string;
    latitude: number;
    longitude: number;
    listeningRadiusMeters: number;
}
