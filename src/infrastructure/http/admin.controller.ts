import { Body, Controller, Delete, Get, Inject, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
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
import { AdminListCategoriesUseCase } from '../../application/use-cases/admin-list-categories.use-case';
import { AdminSaveCategoryUseCase } from '../../application/use-cases/admin-save-category.use-case';
import { AdminDeleteCategoryUseCase } from '../../application/use-cases/admin-delete-category.use-case';
import { AdminListReportsUseCase } from '../../application/use-cases/admin-list-reports.use-case';
import { AdminUpdateReportStatusUseCase } from '../../application/use-cases/admin-update-report-status.use-case';
import { AdminListBlocksUseCase } from '../../application/use-cases/admin-list-blocks.use-case';
import { AdminRemoveBlockUseCase } from '../../application/use-cases/admin-remove-block.use-case';
import { AdminCreateBlockUseCase } from '../../application/use-cases/admin-create-block.use-case';
import { AdminCreateBlockDto } from '../../application/dto/admin-create-block.dto';
import { SETTINGS_REPOSITORY, SettingsRepositoryPort } from '../../domain/ports/settings-repository.port';
import { SetRoleLimitsDto, SetMessageLimitsDto } from '../../application/dto/admin-settings.dto';
import { SaveCategoryDto } from '../../application/dto/save-category.dto';
import { UpdateReportStatusDto } from '../../application/dto/update-report-status.dto';
import { ReportStatus } from '../../domain/ports/report-repository.port';
import { UserRole } from '../../domain/entities/user.entity';
import { AdminSetDisabledDto } from '../../application/dto/admin-set-disabled.dto';
import { AdminSetRoleDto } from '../../application/dto/admin-set-role.dto';
import { CurrentUserId } from '../auth/current-user.decorator';

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
    private readonly listCategories: AdminListCategoriesUseCase,
    private readonly saveCategory: AdminSaveCategoryUseCase,
    private readonly deleteCategory: AdminDeleteCategoryUseCase,
    private readonly listReports: AdminListReportsUseCase,
    private readonly updateReportStatus: AdminUpdateReportStatusUseCase,
    private readonly listBlocks: AdminListBlocksUseCase,
    private readonly removeBlock: AdminRemoveBlockUseCase,
    private readonly createBlock: AdminCreateBlockUseCase,
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

  // --- Categorías de anuncio ---
  // Un mod SÍ puede administrar categorías (es contenido/moderación,
  // no una regla de negocio de toda la plataforma como los límites).

  @Get('categories')
  categories() {
    return this.listCategories.execute();
  }

  @Patch('categories/:key')
  saveCategoryRoute(@Param('key') key: string, @Body() dto: SaveCategoryDto) {
    return this.saveCategory.execute(key, dto).then(() => ({ ok: true }));
  }

  @Delete('categories/:key')
  deleteCategoryRoute(@Param('key') key: string) {
    return this.deleteCategory.execute(key).then(() => ({ ok: true }));
  }

  // --- Denuncias ---

  @Get('reports')
  reports(@Query('status') status?: ReportStatus) {
    return this.listReports.execute(status);
  }

  @Patch('reports/:id')
  updateReport(
    @CurrentUserId() adminId: string,
    @Param('id') id: string,
    @Body() dto: UpdateReportStatusDto,
  ) {
    return this.updateReportStatus.execute(id, dto.status, adminId).then(() => ({ ok: true }));
  }

  // --- Bloqueos ---

  @Get('blocks')
  blocks() {
    return this.listBlocks.execute();
  }

  @Post('blocks')
  createBlockRoute(@Body() dto: AdminCreateBlockDto) {
    return this.createBlock.execute(dto.blockerId, dto.blockedId).then(() => ({ ok: true }));
  }

  @Delete('blocks')
  removeBlockRoute(@Query('blockerId') blockerId: string, @Query('blockedId') blockedId: string) {
    return this.removeBlock.execute(blockerId, blockedId).then(() => ({ ok: true }));
  }
}
