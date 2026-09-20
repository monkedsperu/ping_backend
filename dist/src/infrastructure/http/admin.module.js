"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminModule = void 0;
const common_1 = require("@nestjs/common");
const admin_controller_1 = require("./admin.controller");
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
const ping_repository_port_1 = require("../../domain/ports/ping-repository.port");
const ping_view_repository_port_1 = require("../../domain/ports/ping-view-repository.port");
const ping_thread_repository_port_1 = require("../../domain/ports/ping-thread-repository.port");
const thread_message_repository_port_1 = require("../../domain/ports/thread-message-repository.port");
const user_repository_port_1 = require("../../domain/ports/user-repository.port");
const settings_repository_port_1 = require("../../domain/ports/settings-repository.port");
const prisma_ping_repository_1 = require("../persistence/prisma-ping.repository");
const prisma_ping_view_repository_1 = require("../persistence/prisma-ping-view.repository");
const prisma_ping_thread_repository_1 = require("../persistence/prisma-ping-thread.repository");
const prisma_thread_message_repository_1 = require("../persistence/prisma-thread-message.repository");
const prisma_user_repository_1 = require("../persistence/prisma-user.repository");
const prisma_settings_repository_1 = require("../persistence/prisma-settings.repository");
let AdminModule = class AdminModule {
};
exports.AdminModule = AdminModule;
exports.AdminModule = AdminModule = __decorate([
    (0, common_1.Module)({
        controllers: [admin_controller_1.AdminController],
        providers: [
            admin_guard_1.AdminGuard,
            super_admin_guard_1.SuperAdminGuard,
            admin_get_dashboard_use_case_1.AdminGetDashboardUseCase,
            admin_get_timeseries_use_case_1.AdminGetTimeseriesUseCase,
            admin_list_users_use_case_1.AdminListUsersUseCase,
            admin_set_user_disabled_use_case_1.AdminSetUserDisabledUseCase,
            admin_set_user_role_use_case_1.AdminSetUserRoleUseCase,
            admin_get_user_detail_use_case_1.AdminGetUserDetailUseCase,
            admin_list_pings_use_case_1.AdminListPingsUseCase,
            admin_get_ping_use_case_1.AdminGetPingUseCase,
            admin_get_ping_threads_use_case_1.AdminGetPingThreadsUseCase,
            admin_get_conversation_use_case_1.AdminGetConversationUseCase,
            { provide: ping_repository_port_1.PING_REPOSITORY, useClass: prisma_ping_repository_1.PrismaPingRepository },
            { provide: ping_view_repository_port_1.PING_VIEW_REPOSITORY, useClass: prisma_ping_view_repository_1.PrismaPingViewRepository },
            { provide: ping_thread_repository_port_1.PING_THREAD_REPOSITORY, useClass: prisma_ping_thread_repository_1.PrismaPingThreadRepository },
            { provide: thread_message_repository_port_1.THREAD_MESSAGE_REPOSITORY, useClass: prisma_thread_message_repository_1.PrismaThreadMessageRepository },
            { provide: user_repository_port_1.USER_REPOSITORY, useClass: prisma_user_repository_1.PrismaUserRepository },
            { provide: settings_repository_port_1.SETTINGS_REPOSITORY, useClass: prisma_settings_repository_1.PrismaSettingsRepository },
        ],
    })
], AdminModule);
