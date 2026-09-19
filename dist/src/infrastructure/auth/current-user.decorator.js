"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurrentUserIdOptional = exports.CurrentUserId = void 0;
const common_1 = require("@nestjs/common");
/**
 * Uso: create(@CurrentUserId() userId: string, ...). Evita que cada
 * controlador tenga que saber que el id vive en request.user.sub.
 */
exports.CurrentUserId = (0, common_1.createParamDecorator)((_data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    return user.sub;
});
/**
 * Igual que CurrentUserId, pero para rutas con OptionalJwtAuthGuard donde
 * puede no haber ningún usuario autenticado (navegación sin cuenta).
 */
exports.CurrentUserIdOptional = (0, common_1.createParamDecorator)((_data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    return user?.sub ?? null;
});
