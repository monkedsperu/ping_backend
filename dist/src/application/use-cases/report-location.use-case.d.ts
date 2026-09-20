import { UserLocationRepositoryPort } from '../../domain/ports/user-location-repository.port';
import { UserRepositoryPort } from '../../domain/ports/user-repository.port';
import { SettingsRepositoryPort } from '../../domain/ports/settings-repository.port';
import { ReportLocationDto } from '../dto/report-location.dto';
export declare class ReportLocationUseCase {
    private readonly userLocationRepository;
    private readonly userRepository;
    private readonly settingsRepository;
    constructor(userLocationRepository: UserLocationRepositoryPort, userRepository: UserRepositoryPort, settingsRepository: SettingsRepositoryPort);
    execute(userId: string, dto: ReportLocationDto): Promise<void>;
}
