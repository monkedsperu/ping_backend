import { AdminGetDashboardUseCase } from '../../application/use-cases/admin-get-dashboard.use-case';
import { AdminGetTimeseriesUseCase } from '../../application/use-cases/admin-get-timeseries.use-case';
import { AdminListUsersUseCase } from '../../application/use-cases/admin-list-users.use-case';
import { AdminSetUserDisabledUseCase } from '../../application/use-cases/admin-set-user-disabled.use-case';
import { AdminSetUserRoleUseCase } from '../../application/use-cases/admin-set-user-role.use-case';
import { AdminGetUserDetailUseCase } from '../../application/use-cases/admin-get-user-detail.use-case';
import { AdminListPingsUseCase } from '../../application/use-cases/admin-list-pings.use-case';
import { AdminGetPingUseCase } from '../../application/use-cases/admin-get-ping.use-case';
import { AdminGetPingThreadsUseCase } from '../../application/use-cases/admin-get-ping-threads.use-case';
import { AdminGetConversationUseCase } from '../../application/use-cases/admin-get-conversation.use-case';
import { SettingsRepositoryPort } from '../../domain/ports/settings-repository.port';
import { SetRoleLimitsDto, SetMessageLimitsDto } from '../../application/dto/admin-settings.dto';
import { UserRole } from '../../domain/entities/user.entity';
import { AdminSetDisabledDto } from '../../application/dto/admin-set-disabled.dto';
import { AdminSetRoleDto } from '../../application/dto/admin-set-role.dto';
export declare class AdminController {
    private readonly getDashboard;
    private readonly getTimeseries;
    private readonly listUsers;
    private readonly setUserDisabled;
    private readonly setUserRole;
    private readonly getUserDetail;
    private readonly listPings;
    private readonly getPing;
    private readonly getPingThreads;
    private readonly getConversation;
    private readonly settingsRepository;
    constructor(getDashboard: AdminGetDashboardUseCase, getTimeseries: AdminGetTimeseriesUseCase, listUsers: AdminListUsersUseCase, setUserDisabled: AdminSetUserDisabledUseCase, setUserRole: AdminSetUserRoleUseCase, getUserDetail: AdminGetUserDetailUseCase, listPings: AdminListPingsUseCase, getPing: AdminGetPingUseCase, getPingThreads: AdminGetPingThreadsUseCase, getConversation: AdminGetConversationUseCase, settingsRepository: SettingsRepositoryPort);
    dashboard(): Promise<import("../../application/use-cases/admin-get-dashboard.use-case").AdminDashboard>;
    timeseries(): Promise<import("../../application/use-cases/admin-get-timeseries.use-case").DayPoint[]>;
    users(): Promise<import("../../application/use-cases/admin-list-users.use-case").AdminUserView[]>;
    userDetail(id: string): Promise<import("../../application/use-cases/admin-get-user-detail.use-case").AdminUserDetail>;
    setDisabled(id: string, dto: AdminSetDisabledDto): Promise<{
        ok: boolean;
    }>;
    setRole(id: string, dto: AdminSetRoleDto): Promise<{
        ok: boolean;
    }>;
    pings(): Promise<import("../../application/use-cases/admin-list-pings.use-case").AdminPingView[]>;
    pingDetail(id: string): Promise<import("../../application/use-cases/admin-get-ping.use-case").AdminPingDetail>;
    pingThreads(id: string): Promise<import("../../application/use-cases/admin-get-ping-threads.use-case").AdminThreadView[]>;
    conversation(id: string, responderId: string): Promise<import("../../application/use-cases/admin-get-conversation.use-case").AdminMessageView[]>;
    getRoleLimits(): Promise<import("../../domain/entities/role-limits.defaults").RoleLimitsValue[]>;
    setRoleLimits(role: UserRole, dto: SetRoleLimitsDto): Promise<{
        ok: boolean;
    }>;
    getMessageLimits(): Promise<import("../../domain/ports/settings-repository.port").MessageLimitsValue>;
    setMessageLimits(dto: SetMessageLimitsDto): Promise<{
        ok: boolean;
    }>;
}
