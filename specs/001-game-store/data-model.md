# Data Model: Q Brands

**Date**: 2026-10-02. Diseno, no migracion ejecutada.
**Related**: [spec](spec.md), [backend contract](contracts/backend.md).

## Ownership and money

JSON es la fuente editorial de ofertas; una publicacion confiable y validada carga Postgres.
Postgres es autoridad de checkout. RAWG solo aporta metadata, sin precio ni disponibilidad.
CLP es entero sin decimales; no calcular importes con floats. Cantidades enteras entre 1 y 99,
limitadas ademas por disponibilidad de demostracion. Todas las fechas son UTC ISO 8601.

## Game

Metadata normalizada, no tabla de precios: `rawgId` entero positivo, `slug`, `title`,
`descriptionText`, `imageUrl|null`, `genres[]`, `platforms[]`, `released|null`, `rating|null`,
`source=rawg`, `sourceUrl`, `fetchedAt`. Campos ausentes permanecen null o arrays vacios.
Descripcion externa convertida a texto, sin HTML remoto inseguro.
Cache publico opcional con TTL de 5 minutos, sin tokens y sin datos de usuario.

## Offer

Tabla `offers`: `id` text (SKU legacy estable), `rawg_id` nullable verificado,
`title`, `category`, `cover`, `description`, `edition`, `activation_platform`,
`activation_region`, `currency=CLP`, `regular_price`, `sale_price`,
`available_units` integer (solo demostracion), `status`, `version`, `published_at`.
El JSON conserva nombres legacy `id/name/category/cover/regularPrice/salePrice` y agrega
campos equivalentes nuevos; adaptadores traducen entre JSON/SQL/DTO sin renombrar SKU antiguo.

- `0 <= sale_price <= regular_price`; oferta pagable requiere `sale_price > 0` y metadata completa.
- `status`: `active`, `unavailable`, `incomplete`, `free_external`. Solo active es vendible.
- Juegos gratuitos tienen `free_external` y enlace oficial; no crear preferencia ni pedido
  pagado. No usar un precio ausente como cero ni subirlo para pasar una validacion.
- Completitud de edicion/plataforma/region requiere revision editorial; no deducir por nombre.
- Relacion: Game 1:N Offer; RAWG games sin Offer siguen siendo solo descubrimiento.
- Version aumenta ante cambios de importe, disponibilidad o condiciones de activacion.
- Disponibilidad es fixture academico, no prueba de posesion de claves ni promesa de entrega.

## Account and session

`auth.users` de Supabase conserva identidad y credenciales; no tabla de contrasenas propia.
Cuenta: `userId` UUID, email verificado, nombre visible opcional. Sesion: tokens del SDK,
expiracion y usuario actual; no incluir tokens en pedidos, logs, JSON local ni fixtures publicos.
UI: `initializing -> anonymous|authenticated -> expired|anonymous`.
Registro pendiente de confirmacion no habilita checkout. Recovery valida codigo/verifier
antes de permitir actualizar contrasena. Invalidar cache de pedidos ante todo cambio de usuario.

## Cart

Owner unico: CartProvider + reducer puro, almacenado con useState funcional.
DTO version 2: `schemaVersion=2`, `items[{offerId, quantity, offerVersion, snapshot}]`.
Snapshot publico incluye nombre, cover y precio mostrado, nunca datos de pago ni identidad.
Key legacy `qBrandsCart` se mantiene, con lector para array antiguo y envelope v2.
API de contexto existente se mantiene: `items`, `itemCount`, `total`, `addProduct`,
`changeQuantity`, `removeProduct`, `clearCart`; nuevas acciones internas solo si necesarias.

Migracion: leer sin fallar por JSON invalido; validar SKU por oferta, cantidad y completitud;
fusionar IDs repetidos dentro del limite; conservar solo lineas validas. Reportar descartes
y guardar v2 solo despues de migracion exitosa. Fallo storage deja carrito en memoria con aviso.
No confiar en snapshot para cobrar; cambio de oferta obliga revalidar quote.

Carrito de visitante no es dato privado de cuenta y permanece al acceder; pedidos no se
transfieren al cambiar de cuenta. Confirmacion aprobada resta solo unidades compradas de
lineas correspondientes, conservando adiciones posteriores. Recibo procesado una sola vez
por `(userId, orderId)`; retorno de otro usuario no cambia carrito ni muestra pedido.

## Quote

Tabla `quotes`: `id` UUID, `user_id`, `lines` con SKU/version/cantidad/precios y condiciones,
`currency`, `subtotal`, `fees=0`, `total`, `created_at`, `expires_at`, `consumed_order_id|null`.
TTL 5 min. Normalizar lineas en orden de SKU; recalcular importes servidor y devolver snapshot.
Cliente acepta un quote concreto, no un total libre. Sin reserva al cotizar.
Si vence o cambia version antes de checkout: 409 con motivo y quote nuevo tras nueva solicitud;
el usuario vuelve a aceptar. Fee cero es explicito; descuentos ya incluidos por linea.

## Order and line

`orders`: `id` UUID, `user_id`, `quote_id` unico, `currency`, `subtotal`, `fees`, `total`,
`status`, `environment=sandbox`, `created_at`, `updated_at`.
`order_lines`: `(order_id, offer_id)` unico, `quantity`, snapshot de titulo/edicion/plataforma/
region, `unit_price`, `offer_version`, `line_total`. Snapshot inmutable tras autorizacion.
Usuario viene del JWT validado y nunca de `user_id` enviado por navegador.

Creacion transaccional consume quote una sola vez, bloquea ofertas, valida stock y reserva
unidades demo. Decrementar disponibilidad o registrar reserva exclusiva en la misma transaccion.
Rechazo/cancelacion autoritativos liberan reserva una sola vez; aprobacion la consume una sola vez.
Pendientes/desconocidos mantienen reserva hasta reconciliacion: nunca liberar mientras el
proveedor aun pueda aprobar ni reintentar otra preferencia automaticamente.

Estados normalizados: `awaiting_payment`, `pending`, `approved`, `rejected`, `cancelled`,
`review_required`. Una aprobacion no se revierte por evento viejo. Reembolso/contracargo
posterior se registra como excepcion operativa, sin entrega real ni transicion falsa a rechazo.
No hay pedido aprobado solo por callback; aprobado siempre significa pago de prueba verificado.

## Checkout attempt and idempotency

`checkout_attempts`: `id` UUID, `order_id`, `user_id`, `idempotency_key`, `request_hash`,
`state`, `provider_preference_id|null`, `checkout_url|null`, `created_at`, `updated_at`.
Unico `(user_id, idempotency_key)`; un intento activo por pedido.
`state`: `creating -> ready|creation_unknown|failed`; respuesta guardada se reutiliza.
La clave con otro hash devuelve 409. No expirar una clave y crear otro pedido para el mismo quote.
Creacion incierta requiere reconciliacion/revision, no llamada ciega al proveedor de nuevo.

## Payment and webhook receipt

`payments`: proveedor, `provider_payment_id` unico, `order_id`, `preference_id`,
`collector_id`, `currency`, `amount`, `provider_status`, `status`, `live_mode=false`,
`provider_updated_at`, `verified_at`. Un pedido puede recibir varios intentos del proveedor;
la transaccion impide efectos repetidos, pero registra una segunda aprobacion como incidente.

`webhook_receipts`: `id`, `event_fingerprint` unico, `payment_id`, `provider_event_time`,
`received_at`, `processing_state`, `attempt_count`, `next_attempt_at`, `error_code`.
Guardar IDs/metadatos minimos; no guardar PAN, contrasenas, payloads completos con PII ni tokens.
Deduplicar evento exacto, no todos los eventos de un mismo payment ID. Estado cambia solo
tras lectura autenticada al proveedor y validacion de propietario, referencia, moneda y monto.
Retry durable con backoff; reconciliacion programada recupera eventos fallidos/pendientes.

## Authorization and invariants

- Todas las tablas privadas usan RLS: SELECT solo `user_id = auth.uid()`; lineas via pedido.
- Navegador nunca inserta/modifica `orders`, `quotes`, `payments`, intentos ni receipts directamente.
- Ofertas publicas exponen solo metadata aprobada; sin escritura de cliente.
- Edge Functions verifican JWT antes de usar credencial privilegiada, y vuelven a comprobar owner.
- Catalogo publico y webhook son excepciones de gateway explicitas: catalogo valida/rate-limita;
  webhook requiere firma valida, aunque no requiere sesion Supabase.
- Transacciones/procedimientos internos restringidos a rol servidor: quote, pedido/reserva,
  idempotencia y aplicar resultado no pueden intercalarse dejando efectos parciales.
- Todos los pagos deben tener importe positivo, CLP, vendedor de prueba configurado y
  `live_mode=false`; incumplimiento lleva a review_required, no approved.
- No generar claves reales, no marcar pagos productivos como prueba y no vender metadata sola.
