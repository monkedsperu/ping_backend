"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const admin_guard_1 = require("../auth/admin.guard");
const super_admin_guard_1 = require("../auth/super-admin.guard");
const admin_get_dashboard_use_case_1 = require("../../application/use-cases/admin-get-dashboard.use-case");
const admin_get_timeseries_use_case_1 = require("../../application/use-cases/admin-get-timeseries.use-case");
const admin_list_users_use_case_1 = require("../../application/use-cases/admin-list-users.use-case");
const admin_set_user_disabled_use_case_1 = require("../../application/use-cases/admin-set-user-disabled.use-case");
const admin_set_user_role_use_case_1 = require("../../application/use-cases/admin-set-user-role.use-case");
const admin_get_user_detail_use_case_1 = require("../../application/use-cases/admin-get-user-detail.use-case");
const admin_list_pings_use_case_1 = require("../../application/use-cases/admin-list-pings.use-case");
const admin_get_ping_use_case_1 = require("../../application/use-cases/admin-get-ping.use-case");
const admin_get_ping_threads_use_case_1 = require("../../application/use-cases/admin-get-ping-threads.use-case");
const admin_get_conversation_use_case_1 = require("../../application/use-cases/admin-get-conversation.use-case");
const settings_repository_port_1 = require("../../domain/ports/settings-repository.port");
const admin_settings_dto_1 = require("../../application/dto/admin-settings.dto");
const admin_set_disabled_dto_1 = require("../../application/dto/admin-set-disabled.dto");
const admin_set_role_dto_1 = require("../../application/dto/admin-set-role.dto");
let AdminController = class AdminController {
    constructor(getDashboard, getTimeseries, listUsers, setUserDisabled, setUserRole, getUserDetail, listPings, getPing, getPingThreads, getConversation, settingsRepository) {
        this.getDashboard = getDashboard;
        this.getTimeseries = getTimeseries;
        this.listUsers = listUsers;
        this.setUserDisabled = setUserDisabled;
        this.setUserRole = setUserRole;
        this.getUserDetail = getUserDetail;
        this.listPings = listPings;
        this.getPing = getPing;
        this.getPingThreads = getPingThreads;
        this.getConversation = getConversation;
        this.settingsRepository = settingsRepository;
    }
    dashboard() {
        return this.getDashboard.execute();
    }
    timeseries() {
        return this.getTimeseries.execute();
    }
    users() {
        return this.listUsers.execute();
    }
    userDetail(id) {
        return this.getUserDetail.execute(id);
    }
    setDisabled(id, dto) {
        return this.setUserDisabled.execute(id, dto.disabled).then(() => ({ ok: true }));
    }
    // Más estricto: solo un admin de verdad puede otorgar/quitar roles.
    setRole(id, dto) {
        return this.setUserRole.execute(id, dto.role).then(() => ({ ok: true }));
    }
    pings() {
        return this.listPings.execute();
    }
    pingDetail(id) {
        return this.getPing.execute(id);
    }
    pingThreads(id) {
        return this.getPingThreads.execute(id);
    }
    conversation(id, responderId) {
        return this.getConversation.execute(id, responderId);
    }
    // --- Configuración: límites por rol y de mensaje ---
    // Solo un admin de verdad puede tocar esto (no un mod) — cambia el
    // comportamiento de TODA la plataforma, no de un usuario puntual.
    getRoleLimits() {
        return this.settingsRepository.getAllRoleLimits();
    }
    setRoleLimits(role, dto) {
        return this.settingsRepository
            .saveRoleLimits({ role, ...dto })
            .then(() => ({ ok: true }));
    }
    getMessageLimits() {
        return this.settingsRepository.getMessageLimits();
    }
    setMessageLimits(dto) {
        return this.settingsRepository.saveMessageLimits(dto).then(() => ({ ok: true }));
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Get)('dashboard'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "dashboard", null);
__decorate([
    (0, common_1.Get)('dashboard/timeseries'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "timeseries", null);
__decorate([
    (0, common_1.Get)('users'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "users", null);
__decorate([
    (0, common_1.Get)('users/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "userDetail", null);
__decorate([
    (0, common_1.Patch)('users/:id/disabled'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, admin_set_disabled_dto_1.AdminSetDisabledDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "setDisabled", null);
__decorate([
    (0, common_1.UseGuards)(super_admin_guard_1.SuperAdminGuard),
    (0, common_1.Patch)('users/:id/role'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, admin_set_role_dto_1.AdminSetRoleDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "setRole", null);
__decorate([
    (0, common_1.Get)('pings'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "pings", null);
__decorate([
    (0, common_1.Get)('pings/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "pingDetail", null);
__decorate([
    (0, common_1.Get)('pings/:id/threads'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "pingThreads", null);
__decorate([
    (0, common_1.Get)('pings/:id/threads/:responderId/messages'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('responderId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "conversation", null);
__decorate([
    (0, common_1.UseGuards)(super_admin_guard_1.SuperAdminGuard),
    (0, common_1.Get)('settings/roles'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getRoleLimits", null);
__decorate([
    (0, common_1.UseGuards)(super_admin_guard_1.SuperAdminGuard),
    (0, common_1.Patch)('settings/roles/:role'),
    __param(0, (0, common_1.Param)('role')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, admin_settings_dto_1.SetRoleLimitsDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "setRoleLimits", null);
__decorate([
    (0, common_1.UseGuards)(super_admin_guard_1.SuperAdminGuard),
    (0, common_1.Get)('settings/messages'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getMessageLimits", null);
__decorate([
    (0, common_1.UseGuards)(super_admin_guard_1.SuperAdminGuard),
    (0, common_1.Patch)('settings/messages'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [admin_settings_dto_1.SetMessageLimitsDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "setMessageLimits", null);
exports.AdminController = AdminController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, admin_guard_1.AdminGuard),
    (0, common_1.Controller)('admin'),
    __param(10, (0, common_1.Inject)(settings_repository_port_1.SETTINGS_REPOSITORY)),
    __metadata("design:paramtypes", [admin_get_dashboard_use_case_1.AdminGetDashboardUseCase,
        admin_get_timeseries_use_case_1.AdminGetTimeseriesUseCase,
        admin_list_users_use_case_1.AdminListUsersUseCase,
        admin_set_user_disabled_use_case_1.AdminSetUserDisabledUseCase,
        admin_set_user_role_use_case_1.AdminSetUserRoleUseCase,
        admin_get_user_detail_use_case_1.AdminGetUserDetailUseCase,
        admin_list_pings_use_case_1.AdminListPingsUseCase,
        admin_get_ping_use_case_1.AdminGetPingUseCase,
        admin_get_ping_threads_use_case_1.AdminGetPingThreadsUseCase,
        admin_get_conversation_use_case_1.AdminGetConversationUseCase, Object])
], AdminController);
