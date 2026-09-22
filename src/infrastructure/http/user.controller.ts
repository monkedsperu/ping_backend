import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ReportLocationUseCase } from '../../application/use-cases/report-location.use-case';
import { CreateReportUseCase } from '../../application/use-cases/create-report.use-case';
import { BlockUserUseCase } from '../../application/use-cases/block-user.use-case';
import { UnblockUserUseCase } from '../../application/use-cases/unblock-user.use-case';
import { ListMyBlocksUseCase } from '../../application/use-cases/list-my-blocks.use-case';
import { UpdateVisibleCategoriesUseCase } from '../../application/use-cases/update-visible-categories.use-case';
import { ReportLocationDto } from '../../application/dto/report-location.dto';
import { CreateReportDto } from '../../application/dto/create-report.dto';
import { UpdateVisibleCategoriesDto } from '../../application/dto/update-visible-categories.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUserId } from '../auth/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
  constructor(
    private readonly reportLocation: ReportLocationUseCase,
    private readonly createReport: CreateReportUseCase,
    private readonly blockUser: BlockUserUseCase,
    private readonly unblockUser: UnblockUserUseCase,
    private readonly listMyBlocks: ListMyBlocksUseCase,
    private readonly updateVisibleCategories: UpdateVisibleCategoriesUseCase,
  ) {}

  @Post('location')
  async reportMyLocation(@CurrentUserId() userId: string, @Body() dto: ReportLocationDto) {
    await this.reportLocation.execute(userId, dto);
    return { ok: true };
  }

  @Post('reports')
  async report(@CurrentUserId() reporterId: string, @Body() dto: CreateReportDto) {
    return this.createReport.execute(reporterId, dto);
  }

  @Post(':id/block')
  async block(@CurrentUserId() blockerId: string, @Param('id') blockedId: string) {
    await this.blockUser.execute(blockerId, blockedId);
    return { ok: true };
  }

  @Delete(':id/block')
  async unblock(@CurrentUserId() blockerId: string, @Param('id') blockedId: string) {
    await this.unblockUser.execute(blockerId, blockedId);
    return { ok: true };
  }

  @Get('me/blocks')
  async myBlocks(@CurrentUserId() userId: string) {
    return this.listMyBlocks.execute(userId);
  }

  @Patch('me/categories')
  async setVisibleCategories(
    @CurrentUserId() userId: string,
    @Body() dto: UpdateVisibleCategoriesDto,
  ) {
    await this.updateVisibleCategories.execute(userId, dto.categories);
    return { ok: true };
  }
}
