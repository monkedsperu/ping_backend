import { ReportLocationUseCase } from '../../application/use-cases/report-location.use-case';
import { ReportLocationDto } from '../../application/dto/report-location.dto';
export declare class UserController {
    private readonly reportLocation;
    constructor(reportLocation: ReportLocationUseCase);
    reportMyLocation(userId: string, dto: ReportLocationDto): Promise<{
        ok: boolean;
    }>;
}
