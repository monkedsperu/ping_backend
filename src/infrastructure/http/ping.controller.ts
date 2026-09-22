import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { CreatePingUseCase } from '../../application/use-cases/create-ping.use-case';
import { GetNearbyPingsUseCase } from '../../application/use-cases/get-nearby-pings.use-case';
import { GetPingDetailUseCase } from '../../application/use-cases/get-ping-detail.use-case';
import { StartThreadUseCase } from '../../application/use-cases/start-thread.use-case';
import { SendThreadMessageUseCase } from '../../application/use-cases/send-thread-message.use-case';
import { GetPingThreadsUseCase } from '../../application/use-cases/get-ping-threads.use-case';
import { GetMyPingsUseCase } from '../../application/use-cases/get-my-pings.use-case';
import { GetMyResponsesUseCase } from '../../application/use-cases/get-my-responses.use-case';
import { GetThreadMessagesUseCase } from '../../application/use-cases/get-thread-messages.use-case';
import { GetMyLimitsUseCase } from '../../application/use-cases/get-my-limits.use-case';
import { GetPingCategoriesUseCase } from '../../application/use-cases/get-ping-categories.use-case';
import { ClosePingUseCase } from '../../application/use-cases/close-ping.use-case';
import { DeletePingUseCase } from '../../application/use-cases/delete-ping.use-case';
import { CreatePingDto } from '../../application/dto/create-ping.dto';
import { GetNearbyPingsDto } from '../../application/dto/get-nearby-pings.dto';
import { SendThreadMessageDto } from '../../application/dto/thread-message.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/optional-jwt-auth.guard';
import { CurrentUserId, CurrentUserIdOptional } from '../auth/current-user.decorator';

@Controller('pings')
export class PingController {
  constructor(
    private readonly createPing: CreatePingUseCase,
    private readonly getNearbyPings: GetNearbyPingsUseCase,
    private readonly getPingDetail: GetPingDetailUseCase,
    private readonly startThread: StartThreadUseCase,
    private readonly sendThreadMessage: SendThreadMessageUseCase,
    private readonly getPingThreads: GetPingThreadsUseCase,
    private readonly getMyPings: GetMyPingsUseCase,
    private readonly getMyResponses: GetMyResponsesUseCase,
    private readonly getThreadMessages: GetThreadMessagesUseCase,
    private readonly getMyLimits: GetMyLimitsUseCase,
    private readonly getPingCategories: GetPingCategoriesUseCase,
    private readonly closePing: ClosePingUseCase,
    private readonly deletePing: DeletePingUseCase,
  ) {}

  // --- Configuración: categorías activas — igual que "limits", debe ir
  // ANTES de "@Get(':id')".
  @Get('categories')
  async categories() {
    return this.getPingCategories.execute();
  }

  // --- Configuración: qué puede elegir ESTE usuario ahora mismo ---
  // Debe ir ANTES de "@Get(':id')" — si no, NestJS interpreta "limits"
  // como si fuera el id de un ping.
  @UseGuards(OptionalJwtAuthGuard)
  @Get('limits')
  async myLimits(@CurrentUserIdOptional() viewerId: string | null) {
    return this.getMyLimits.execute(viewerId);
  }

  // --- Lectura: navegable sin cuenta ---

  @UseGuards(OptionalJwtAuthGuard)
  @Get()
  async findNearby(
    @CurrentUserIdOptional() viewerId: string | null,
    @Query() query: GetNearbyPingsDto,
  ) {
    return this.getNearbyPings.execute(query, viewerId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('mine')
  async findMine(@CurrentUserId() authorId: string) {
    return this.getMyPings.execute(authorId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('mine/responses')
  async findMyResponses(@CurrentUserId() responderId: string) {
    return this.getMyResponses.execute(responderId);
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Get(':id')
  async findOne(@CurrentUserIdOptional() viewerId: string | null, @Param('id') id: string) {
    return this.getPingDetail.execute(id, viewerId);
  }

  // --- Escritura: requiere cuenta ---

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@CurrentUserId() authorId: string, @Body() dto: CreatePingDto) {
    const result = await this.createPing.execute(dto, authorId);
    return {
      id: result.ping.id,
      notifiedCount: result.notifiedCount,
      expiresAt: result.ping.expiresAt,
    };
  }

  /** El autor ve la lista de conversaciones que le han abierto. */
  @UseGuards(JwtAuthGuard)
  @Get(':id/threads')
  async listThreads(@CurrentUserId() viewerId: string, @Param('id') pingId: string) {
    return this.getPingThreads.execute(pingId, viewerId);
  }

  /** Iniciar una conversación nueva (primer mensaje de un respondiente). */
  @UseGuards(JwtAuthGuard)
  @Post(':id/threads')
  async createThread(
    @CurrentUserId() responderId: string,
    @Param('id') pingId: string,
    @Body() dto: SendThreadMessageDto,
  ) {
    const result = await this.startThread.execute(pingId, dto, responderId);
    return result.message.toProps();
  }

  /** Ver los mensajes de un hilo (solo los dos participantes pueden). */
  @UseGuards(JwtAuthGuard)
  @Get(':id/threads/:responderId')
  async getThread(
    @CurrentUserId() viewerId: string,
    @Param('id') pingId: string,
    @Param('responderId') responderId: string,
  ) {
    return this.getThreadMessages.execute(pingId, responderId, viewerId);
  }

  /** Continuar una conversación existente. */
  @UseGuards(JwtAuthGuard)
  @Post(':id/threads/:responderId')
  async replyInThread(
    @CurrentUserId() senderId: string,
    @Param('id') pingId: string,
    @Param('responderId') responderId: string,
    @Body() dto: SendThreadMessageDto,
  ) {
    const message = await this.sendThreadMessage.execute(pingId, responderId, dto, senderId);
    return message.toProps();
  }

  /** Marcar como finalizado — sigue existiendo, pero ya no acepta
   * conversaciones nuevas ni aparece como activo. */
  @UseGuards(JwtAuthGuard)
  @Patch(':id/close')
  async close(@CurrentUserId() requesterId: string, @Param('id') id: string) {
    await this.closePing.execute(id, requesterId);
    return { ok: true };
  }

  /** Borrado suave: deja de aparecer en cualquier lado, pero no se borra
   * de verdad (las conversaciones y denuncias pueden seguir refiriéndolo). */
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@CurrentUserId() requesterId: string, @Param('id') id: string) {
    await this.deletePing.execute(id, requesterId);
    return { ok: true };
  }
}
