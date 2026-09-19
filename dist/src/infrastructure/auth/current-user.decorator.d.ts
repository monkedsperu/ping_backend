/**
 * Uso: create(@CurrentUserId() userId: string, ...). Evita que cada
 * controlador tenga que saber que el id vive en request.user.sub.
 */
export declare const CurrentUserId: (...dataOrPipes: unknown[]) => ParameterDecorator;
/**
 * Igual que CurrentUserId, pero para rutas con OptionalJwtAuthGuard donde
 * puede no haber ningún usuario autenticado (navegación sin cuenta).
 */
export declare const CurrentUserIdOptional: (...dataOrPipes: unknown[]) => ParameterDecorator;
