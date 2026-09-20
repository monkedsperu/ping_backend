import { Body, Controller, Get, Inject, Param, Patch, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';
import { SuperAdminGuard } from '../auth/super-admin.guard';
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
import { SETTINGS_REPOSITORY, SettingsRepositoryPort } from '../../domain/ports/settings-repository.port';
import { SetRoleLimitsDto, SetMessageLimitsDto } from '../../application/dto/admin-settings.dto';
import { UserRole } from '../../domain/entities/user.entity';
import { AdminSetDisabledDto } from '../../application/dto/admin-set-disabled.dto';
import { AdminSetRoleDto } from '../../application/dto/admin-set-role.dto';

@UseGuards(JwtAuthGuard, AdminGuard)
@Controller('admin')
export class AdminController {
  constructor(
    private readonly getDashboard: AdminGetDashboardUseCase,
    private readonly getTimeseries: AdminGetTimeseriesUseCase,
    private readonly listUsers: AdminListUsersUseCase,
    private readonly setUserDisabled: AdminSetUserDisabledUseCase,
    private readonly setUserRole: AdminSetUserRoleUseCase,
    private readonly getUserDetail: AdminGetUserDetailUseCase,
    private readonly listPings: AdminListPingsUseCase,
    private readonly getPing: AdminGetPingUseCase,
    private readonly getPingThreads: AdminGetPingThreadsUseCase,
    private readonly getConversation: AdminGetConversationUseCase,
    @Inject(SETTINGS_REPOSITORY) private readonly settingsRepository: SettingsRepositoryPort,
  ) {}

  @Get('dashboard')
  dashboard() {
    return this.getDashboard.execute();
  }

  @Get('dashboard/timeseries')
  timeseries() {
    return this.getTimeseries.execute();
  }

  @Get('users')
  users() {
    return this.listUsers.execute();
  }

  @Get('users/:id')
  userDetail(@Param('id') id: string) {
    return this.getUserDetail.execute(id);
  }

  @Patch('users/:id/disabled')
  setDisabled(@Param('id') id: string, @Body() dto: AdminSetDisabledDto) {
    return this.setUserDisabled.execute(id, dto.disabled).then(() => ({ ok: true }));
  }

  // Más estricto: solo un admin de verdad puede otorgar/quitar roles.
  @UseGuards(SuperAdminGuard)
  @Patch('users/:id/role')
  setRole(@Param('id') id: string, @Body() dto: AdminSetRoleDto) {
    return this.setUserRole.execute(id, dto.role).then(() => ({ ok: true }));
  }

  @Get('pings')
  pings() {
    return this.listPings.execute();
  }

  @Get('pings/:id')
  pingDetail(@Param('id') id: string) {
    return this.getPing.execute(id);
  }

  @Get('pings/:id/threads')
  pingThreads(@Param('id') id: string) {
    return this.getPingThreads.execute(id);
  }

  @Get('pings/:id/threads/:responderId/messages')
  conversation(@Param('id') id: string, @Param('responderId') responderId: string) {
    return this.getConversation.execute(id, responderId);
  }

  // --- Configuración: límites por rol y de mensaje ---
  // Solo un admin de verdad puede tocar esto (no un mod) — cambia el
  // comportamiento de TODA la plataforma, no de un usuario puntual.

  @UseGuards(SuperAdminGuard)
  @Get('settings/roles')
  getRoleLimits() {
    return this.settingsRepository.getAllRoleLimits();
  }

  @UseGuards(SuperAdminGuard)
  @Patch('settings/roles/:role')
  setRoleLimits(@Param('role') role: UserRole, @Body() dto: SetRoleLimitsDto) {
    return this.settingsRepository
      .saveRoleLimits({ role, ...dto })
      .then(() => ({ ok: true }));
  }

  @UseGuards(SuperAdminGuard)
  @Get('settings/messages')
  getMessageLimits() {
    return this.settingsRepository.getMessageLimits();
  }

  @UseGuards(SuperAdminGuard)
  @Patch('settings/messages')
  setMessageLimits(@Body() dto: SetMessageLimitsDto) {
    return this.settingsRepository.saveMessageLimits(dto).then(() => ({ ok: true }));
  }
}
