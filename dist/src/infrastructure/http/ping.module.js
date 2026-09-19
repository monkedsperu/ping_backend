"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PingModule = void 0;
const common_1 = require("@nestjs/common");
const ping_controller_1 = require("./ping.controller");
const create_ping_use_case_1 = require("../../application/use-cases/create-ping.use-case");
const get_nearby_pings_use_case_1 = require("../../application/use-cases/get-nearby-pings.use-case");
const get_ping_detail_use_case_1 = require("../../application/use-cases/get-ping-detail.use-case");
const start_thread_use_case_1 = require("../../application/use-cases/start-thread.use-case");
const send_thread_message_use_case_1 = require("../../application/use-cases/send-thread-message.use-case");
const get_ping_threads_use_case_1 = require("../../application/use-cases/get-ping-threads.use-case");
const get_my_pings_use_case_1 = require("../../application/use-cases/get-my-pings.use-case");
const get_my_responses_use_case_1 = require("../../application/use-cases/get-my-responses.use-case");
const get_thread_messages_use_case_1 = require("../../application/use-cases/get-thread-messages.use-case");
const ping_repository_port_1 = require("../../domain/ports/ping-repository.port");
const ping_thread_repository_port_1 = require("../../domain/ports/ping-thread-repository.port");
const ping_view_repository_port_1 = require("../../domain/ports/ping-view-repository.port");
const thread_message_repository_port_1 = require("../../domain/ports/thread-message-repository.port");
const user_repository_port_1 = require("../../domain/ports/user-repository.port");
const user_locator_port_1 = require("../../domain/ports/user-locator.port");
const notification_port_1 = require("../../domain/ports/notification.port");
const prisma_ping_repository_1 = require("../persistence/prisma-ping.repository");
const prisma_ping_thread_repository_1 = require("../persistence/prisma-ping-thread.repository");
const prisma_ping_view_repository_1 = require("../persistence/prisma-ping-view.repository");
const prisma_thread_message_repository_1 = require("../persistence/prisma-thread-message.repository");
const prisma_user_repository_1 = require("../persistence/prisma-user.repository");
const prisma_user_locator_repository_1 = require("../persistence/prisma-user-locator.repository");
const fcm_notification_adapter_1 = require("../notifications/fcm-notification.adapter");
/**
 * Este es el único archivo del proyecto que "sabe" qué adaptador concreto
 * cumple cada puerto. Cambiar de Postgres a otra base, o de FCM a otro
 * proveedor push, es reemplazar el `useClass` de abajo — nada más.
 */
let PingModule = class PingModule {
};
exports.PingModule = PingModule;
exports.PingModule = PingModule = __decorate([
    (0, common_1.Module)({
        controllers: [ping_controller_1.PingController],
        providers: [
            create_ping_use_case_1.CreatePingUseCase,
            get_nearby_pings_use_case_1.GetNearbyPingsUseCase,
            get_ping_detail_use_case_1.GetPingDetailUseCase,
            start_thread_use_case_1.StartThreadUseCase,
            send_thread_message_use_case_1.SendThreadMessageUseCase,
            get_ping_threads_use_case_1.GetPingThreadsUseCase,
            get_my_pings_use_case_1.GetMyPingsUseCase,
            get_my_responses_use_case_1.GetMyResponsesUseCase,
            get_thread_messages_use_case_1.GetThreadMessagesUseCase,
            { provide: ping_repository_port_1.PING_REPOSITORY, useClass: prisma_ping_repository_1.PrismaPingRepository },
            { provide: ping_thread_repository_port_1.PING_THREAD_REPOSITORY, useClass: prisma_ping_thread_repository_1.PrismaPingThreadRepository },
            { provide: ping_view_repository_port_1.PING_VIEW_REPOSITORY, useClass: prisma_ping_view_repository_1.PrismaPingViewRepository },
            { provide: thread_message_repository_port_1.THREAD_MESSAGE_REPOSITORY, useClass: prisma_thread_message_repository_1.PrismaThreadMessageRepository },
            { provide: user_repository_port_1.USER_REPOSITORY, useClass: prisma_user_repository_1.PrismaUserRepository },
            { provide: user_locator_port_1.USER_LOCATOR, useClass: prisma_user_locator_repository_1.PrismaUserLocatorRepository },
            { provide: notification_port_1.NOTIFICATION_SENDER, useClass: fcm_notification_adapter_1.FcmNotificationAdapter },
        ],
    })
], PingModule);
