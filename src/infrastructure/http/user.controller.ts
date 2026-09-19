import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ReportLocationUseCase } from '../../application/use-cases/report-location.use-case';
import { ReportLocationDto } from '../../application/dto/report-location.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUserId } from '../auth/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
  constructor(private readonly reportLocation: ReportLocationUseCase) {}

  @Post('location')
  async reportMyLocation(@CurrentUserId() userId: string, @Body() dto: ReportLocationDto) {
    await this.reportLocation.execute(userId, dto);
    return { ok: true };
  }
}
