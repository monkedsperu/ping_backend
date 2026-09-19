import { UserLocationRepositoryPort } from '../../domain/ports/user-location-repository.port';
import { ReportLocationDto } from '../dto/report-location.dto';
export declare class ReportLocationUseCase {
    private readonly userLocationRepository;
    constructor(userLocationRepository: UserLocationRepositoryPort);
    execute(userId: string, dto: ReportLocationDto): Promise<void>;
}
