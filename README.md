# Al toque — backend del MVP

Backend del MVP: crear pings hiperlocales, verlos cerca, responder rápido.
Sin pagos, sin planes, sin karma — esas piezas se agregan después de validar
que el mecanismo base (alguien pregunta, alguien cerca responde) funciona.

## Stack

- **NestJS + TypeScript**: framework con inyección de dependencias real,
  el estándar de facto para APIs Node estructuradas.
- **PostgreSQL + PostGIS**: estándar de la industria para consultas
  geoespaciales ("usuarios a X metros de este punto").
- **Prisma**: ORM para todo lo relacional; las consultas geoespaciales usan
  SQL crudo (`$queryRaw`) porque Prisma no modela `geography` nativamente.
- **Firebase Cloud Messaging**: notificaciones push, para no reinventar
  el envío a iOS/Android.

## Arquitectura: hexagonal (puertos y adaptadores)

```
src/
  domain/           # Reglas de negocio puras. Cero dependencias externas.
    entities/       # Ping, PingResponse
    value-objects/  # GeoPoint
    ports/          # Interfaces que el dominio necesita del exterior

  application/      # Casos de uso. Dependen SOLO de los ports (interfaces),
    use-cases/      # nunca de una implementación concreta.
    dto/

  infrastructure/   # Adaptadores concretos: la única capa que sabe que
    persistence/    # existe Postgres, Prisma, PostGIS o Firebase.
    notifications/
    http/           # Controladores NestJS, delgados, sin lógica de negocio.
```

**Por qué esto da bajo acoplamiento en la práctica:**

- `CreatePingUseCase` no importa Prisma ni Firebase — solo las interfaces
  `PingRepositoryPort`, `UserLocatorPort`, `NotificationPort`. Por eso se
  puede testear con dobles de prueba en memoria (ver
  `test/application/create-ping.use-case.spec.ts`), sin levantar una base
  de datos real.
- Si mañana cambias de PostgreSQL a otra base, o de FCM a otro proveedor
  push, solo reescribes el adaptador correspondiente en `infrastructure/`
  y actualizas el binding en `ping.module.ts`. Ningún caso de uso ni
  entidad de dominio se toca.
- El controlador HTTP es intercambiable: los mismos casos de uso podrían
  exponerse por una cola de mensajes o un CLI sin duplicar lógica.

## Cómo correr esto

```bash
npm install
cp .env.example .env   # completa DATABASE_URL y las credenciales de Firebase

# Levanta Postgres con PostGIS (ejemplo con Docker):
docker run -d --name al-toque-db -e POSTGRES_PASSWORD=password \
  -p 5432:5432 postgis/postgis:16-3.4

npm run prisma:migrate
npm run start:dev
```

## Autenticación

Todos los endpoints salvo `POST /auth/register` y `POST /auth/login` exigen
un JWT en el header `Authorization: Bearer <token>`. El backend nunca
confía en un `authorId`/`responderId`/`userId` que venga en el cuerpo de
la petición — siempre lo saca del token, para que nadie pueda hacerse
pasar por otro usuario.

| Método | Ruta            | Qué hace                                   |
|--------|-----------------|---------------------------------------------|
| POST   | `/auth/register`| Crea una cuenta (`email`, `password`, `displayName`) y devuelve un token |
| POST   | `/auth/login`   | Inicia sesión y devuelve un token           |

## Endpoints del MVP

| Método | Ruta                              | Auth | Qué hace |
|--------|-----------------------------------|------|----------|
| GET    | `/pings?latitude=&longitude=`     | Ninguna | Lista pings activos cerca de un punto |
| GET    | `/pings/:id`                      | Opcional | Detalle de un ping. Si mandas token, indica `isOwnPing` |
| POST   | `/pings`                          | Requerida | Crea un ping |
| GET    | `/pings/:id/threads`              | Requerida | Solo el autor: lista de conversaciones abiertas |
| POST   | `/pings/:id/threads`              | Requerida | Iniciar una conversación (primer mensaje de un respondiente) |
| GET    | `/pings/:id/threads/:responderId` | Requerida | Ver los mensajes de un hilo (solo sus 2 participantes) |
| POST   | `/pings/:id/threads/:responderId` | Requerida | Continuar la conversación |
| POST   | `/uploads/photo`                  | Requerida | Sube una foto y devuelve su URL |
| POST   | `/users/location`                 | Requerida | Reporta ubicación y token push |

### Radio configurable

`radiusMeters` en `POST /pings` ahora es opcional, pero si se manda debe
ser uno de `50`, `100` o `200` (ver `ALLOWED_RADIUS_METERS` en
`ping.entity.ts`) — no cualquier número. Si no se manda, usa 100m por
defecto, igual que antes.

### Radio de escucha: colisión de círculos, no distancia simple

Este es el cambio de fondo de esta vuelta: antes, "pings cercanos" era
literal — pings dentro de X metros de tu punto. Ahora **cada usuario
tiene su propio "radio de escucha"** (100m / 200m / 500m / 1km, guardado
en `UserLastLocation.listeningRadiusMeters`), y un ping te "alcanza" si
tu círculo de escucha **toca** el círculo de alcance de ese ping —
`ST_DWithin(location, tu_punto, tu_radio_de_escucha + radio_del_ping)`.
Esto es intencionalmente simétrico: el mismo cálculo decide tanto qué ves
en `GET /pings` como a quién se le manda la notificación push cuando
alguien crea un ping (`PrismaUserLocatorRepository`) — un solo concepto,
dos usos.

`GET /pings` ahora exige `listeningRadiusMeters` como parámetro (uno de
100/200/500/1000/2000), y `POST /users/location` lo exige también en cada
reporte de ubicación — el cliente reenvía su preferencia guardada cada
vez, el backend no la "recuerda" por su cuenta.

### "Mis pings": historial independiente de dónde estés ahora

`GET /pings/mine` devuelve TODOS los pings que has creado, sin importar
tu radio de escucha actual ni si siguen activos — para que nunca pierdas
acceso a las conversaciones de un ping que puede haber quedado fuera de
tu círculo de escucha en este momento (los pusiste en otro lado del mapa,
o simplemente cambiaste tu radio).

### Pings expirados: sin conversaciones nuevas

Cuando un ping expira (`Ping.isActive()` da `false`), tanto abrir un hilo
nuevo (`POST /pings/:id/threads`) como escribir en uno que ya existía
(`POST /pings/:id/threads/:responderId`) quedan bloqueados (`403`). Sigue
pudiéndose **leer** lo que ya se conversó — solo no se puede agregar nada
más.

### Color y duración configurables

`POST /pings` ahora acepta `color` (hex de 6 dígitos, ej. `#D85A30`,
opcional) y `durationMinutes` (uno de 5/15/30/60/360/1440, opcional —
default 60). Igual que el radio, son conjuntos cerrados de valores, no
cualquier número.

### "Mis respuestas": encontrar una conversación que ya empezaste

Si respondiste un ping y luego cambias tu radio de escucha (o simplemente
te mueves), ese ping puede dejar de aparecer en `GET /pings` — pero la
conversación sigue existiendo y sigue activa hasta que el ping expire.
`GET /pings/mine/responses` devuelve todas tus conversaciones como
respondiente, sin importar tu ubicación o radio actual, para que nunca
pierdas acceso a una que ya iniciaste.

### El modelo de conversación (hilos)

Responder a un ping ya no es un mensaje suelto: es el primer mensaje de un
**hilo** entre el autor y esa persona. Cada respondiente tiene su propio
hilo privado — no se ven entre ellos, y ninguna tercera persona (ni
siquiera otro usuario autenticado válido) puede leer o escribir en un
hilo del que no es participante (`SendThreadMessageUseCase` y
`GetThreadMessagesUseCase` lo verifican explícitamente).

Reglas que siguen aplicando igual que antes:
- El autor no puede iniciar un hilo en su propio ping (`403`).
- Cada persona solo puede tener **un** hilo por ping — si ya escribió,
  el segundo intento de "iniciar" falla (`409`); a partir de ahí sigue
  escribiendo con el endpoint de "continuar conversación".

### Nota de privacidad: coordenadas exactas

`GET /pings` y `GET /pings/:id` ahora devuelven la latitud/longitud
exacta de cada ping (antes solo mandaban `distanceMeters`), para que el
frontend pueda dibujarlo en un mapa. Esto es intencional para este
producto — el caso de uso central (mascota perdida, "hay cola en el
banco") depende de saber el punto exacto — pero es una decisión de
producto, no un descuido: cualquier extensión futura (por ejemplo, un
tipo de ping más "sensible") debería revisar si conviene difuminar la
ubicación en vez de dar el punto exacto.

### Navegación sin cuenta

`GET /pings` y `GET /pings/:id` no requieren sesión — cualquiera puede ver
qué está pasando cerca antes de decidir registrarse. Todo lo demás (crear
un ping, responder, ver conversaciones) sí requiere cuenta. `GET /pings/:id`
usa un guard "opcional": si mandas token, identifica si el ping es tuyo;
si no mandas nada, sigue funcionando igual, solo que `isOwnPing` siempre
sale `false`.

### Actualización en (casi) tiempo real

No hay websockets todavía — el frontend hace polling (pide la lista de
pings cada 15s, y los mensajes de un hilo abierto cada 4s). Es una
solución honesta para el MVP: funciona, es simple, pero no es instantáneo.
Si el piloto valida el mecanismo y el volumen de usuarios lo justifica,
el siguiente paso técnico natural es reemplazar el polling por websockets
(`@nestjs/websockets` + `socket.io`) sin tener que rediseñar los casos de
uso — seguirían siendo los mismos, solo cambiaría cómo se entregan los
resultados al cliente.

## Configurar Firebase (necesario para notificaciones push y fotos)

1. En la consola de Firebase, genera una service account (Configuración del
   proyecto → Cuentas de servicio → Generar nueva clave privada) y guarda el
   JSON como `firebase-service-account.json` en la raíz del proyecto.
2. En tu `.env`, define `FIREBASE_SERVICE_ACCOUNT_PATH` apuntando a ese
   archivo y `FIREBASE_STORAGE_BUCKET` con el bucket de tu proyecto
   (formato `tu-proyecto.appspot.com`, visible en Storage dentro de la
   consola de Firebase).
3. Sin esto configurado, el servidor arranca igual (verás una advertencia
   en consola), pero `/uploads/photo` fallará y las notificaciones push no
   se enviarán — crear/ver/responder pings sigue funcionando normalmente.

## Configurar login con Google

1. Ve a [Google Cloud Console](https://console.cloud.google.com/) → el mismo
   proyecto que ya usas para Maps (o uno nuevo) → **APIs y servicios** →
   **Pantalla de consentimiento OAuth**: configúrala en modo "Externo",
   con el nombre de tu app y tu correo de soporte (para desarrollo, no
   hace falta verificarla con Google todavía).
2. **Credenciales** → **Crear credenciales** → **ID de cliente OAuth**.
   Vas a crear **tres** (uno por plataforma), porque Google firma el
   token distinto según desde dónde se pidió:
   - **Aplicación web**: para probar en el navegador. En "Orígenes
     autorizados de JavaScript" agrega `http://localhost:8081` (o el
     puerto que uses con Expo web).
   - **iOS**: pide el "Bundle ID" — usa el mismo que tengas en
     `app.json` (`expo.ios.bundleIdentifier`, agrégalo si no existe).
   - **Android**: pide el "Package name" (`expo.android.package` en
     `app.json`) y la huella SHA-1 de tu build de desarrollo.
3. Copia las tres client IDs a tu `.env`:
   `GOOGLE_CLIENT_ID_WEB`, `GOOGLE_CLIENT_ID_IOS`, `GOOGLE_CLIENT_ID_ANDROID`.
4. Las mismas tres van también en el `app.json` del **frontend**
   (`expo.extra.googleClientIdWeb/Ios/Android`) — son públicas (no son
   secretas, identifican a tu app, no autentican nada por sí solas).

Mientras no configures nada de esto: `POST /auth/google` responde `401`
con un mensaje claro en vez de tronar, y el registro/login por correo
sigue funcionando exactamente igual que antes — este es un método de
login adicional, no un reemplazo.

### Por qué el passwordHash ahora es opcional

Una cuenta creada con Google no tiene contraseña (nunca la escribiste).
`User.passwordHash` es `null` en ese caso, y `LoginUserUseCase` rechaza
explícitamente el login por contraseña para esas cuentas con un mensaje
claro ("esta cuenta usa Google"), en vez de un error críptico de bcrypt
comparando contra `null`. Si ya tenías una cuenta con contraseña e
inicias sesión con Google usando el mismo correo, se vinculan (mismo
usuario, ahora con las dos formas de entrar) — no se duplica la cuenta.

## Deliberadamente fuera del MVP

Ver `domain/entities/ping.entity.ts`: radio (100m) y duración (60min) están
fijos por diseño, no configurables. No hay cuentas de negocio, planes pagos,
karma ni chat completo. Agregarlos implica: nuevas entidades de dominio,
nuevos casos de uso, y — gracias a la arquitectura — cero cambios en lo que
ya existe.

## Pendiente antes de producción (no bloqueante para el piloto)

- El token JWT dura 30 días y no hay refresh tokens ni forma de revocar
  uno (cerrar sesión en el cliente es lo único que "cierra sesión" hoy).
  Suficiente para un piloto, no para producción real.
- `JWT_SECRET` debe ser un valor largo y aleatorio real en producción —
  el de `.env.example` es solo para desarrollo local.
- Job periódico que marque `status = 'expired'` en pings vencidos.
- Rate limiting para evitar spam de pings o intentos de login.
- Validar tamaño/orientación de imagen del lado del cliente antes de subir
  (el backend solo valida tipo MIME y tamaño máximo de 5MB).
- No hay recuperación de contraseña ("olvidé mi contraseña").
