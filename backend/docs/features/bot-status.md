# Estado de conexión del bot (WhatsApp)

## Problema

El bot de WhatsApp (`src/bot/app.ts`) corre en el mismo proceso que el backend, pero en su propio servidor HTTP (puerto `3008` vs `3001` del API). Al arrancar, Baileys necesita que alguien escanee un QR para autenticarse; hasta ese momento el bot no puede enviar/recibir mensajes.

Se necesitaba una forma de consultar, desde el API (`/api/whatsapp/status`), si el bot está realmente conectado en ese momento — sin depender de si `main()` fue invocado, sin adivinar por logs, y reflejando el estado real de la sesión de WhatsApp.

## Cómo funciona

`BaileysProvider` (de `@builderbot/provider-baileys`) extiende `ProviderClass`, que a su vez extiende un `EventEmitter`. Internamente traduce el evento nativo de Baileys `connection.update` a eventos públicos:

| Evento del provider | Cuándo se dispara                                   |
|----------------------|------------------------------------------------------|
| `require_action`     | Se generó un QR nuevo, falta escanear                 |
| `ready`               | `connection === 'open'` → sesión autenticada          |
| `host`                | Junto con `ready`, trae el número conectado           |
| `auth_failure`        | Logout o error crítico de conexión                    |

Fuente: `node_modules/@builderbot/provider-baileys/dist/index.cjs` (bloque `sock.ev.on('connection.update', ...)`).

### Componentes

- **`src/bot/status.ts`** — singleton `BotStatus`. Guarda el estado en memoria:
  `inactive | initializing | qr_pending | connected | auth_failure`, junto con `host` y `updatedAt`. Expone `setState()` y `getStatus()`.

- **`src/bot/app.ts`** — en `main()`, al crear el `adapterProvider` se suscribe a los 4 eventos de arriba y actualiza el singleton:
  ```ts
  adapterProvider.on("require_action", () => botStatus.setState("qr_pending"))
  adapterProvider.on("ready", () => botStatus.setState("connected"))
  adapterProvider.on("host", (host) => botStatus.setState("connected", host))
  adapterProvider.on("auth_failure", () => botStatus.setState("auth_failure"))
  ```

- **`src/modules/whatsapp/`** — expone el estado siguiendo el patrón `controller -> service` (único endpoint de este módulo que lo usa; `GetQr` se mantuvo tal cual):
  - `whatsapp.controller.ts` → `GetStatus` delega en el service y solo arma la respuesta HTTP.
  - `whatsapp.service.ts` → `WhatsAppService.status()` lee `BotStatus.getInstance().getStatus()` y arma el `BaseResponse`.
  - `dto/whatsapp.ts` → `ConectionData` (shape del estado) y `botStatusResponse` (`BaseResponse<ConectionData>`).
  - `whatsapp.routes.ts` → `GET /status`.

### Endpoint

```
GET /api/whatsapp/status
```

Respuesta (`BaseResponse<ConectionData>`):

```json
{
  "success": true,
  "code": 200,
  "message": "Status del bot solicitado",
  "data": {
    "state": "connected",
    "connected": true,
    "host": { "id": "...", "phone": "521..." },
    "updatedAt": "2026-10-02T18:00:00.000Z"
  }
}
```

## Limitaciones

- El estado vive **en memoria** (singleton del proceso). Si el proceso se reinicia, vuelve a `inactive` hasta que `main()` corra de nuevo y Baileys reporte su estado real — no se persiste en DB ni en cache.
- No distingue reconexiones intermedias (reintentos con backoff) como un estado propio; mientras Baileys reintenta sin éxito definitivo, el estado sigue siendo el último conocido (`connected` o `qr_pending`) hasta que llegue `ready` o `auth_failure`.
