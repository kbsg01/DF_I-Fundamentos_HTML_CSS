# Backend and Provider Contracts

**Date**: 2026-10-02. Diseno contractual, sin endpoints implementados.
**Base**: `https://<project>.supabase.co/functions/v1` (sustituir por entorno configurado).
**Related**: [data model](../data-model.md), [storefront](storefront.md).

## Common rules

JSON UTF-8, fechas UTC, CLP entero. Respuestas incluyen `requestId`; error:
`{error:{code,message,requestId,retryable}}`, sin tokens, claves upstream ni stack traces.
401 falta/sesion invalida, 403 owner o permiso, 404 recurso inexistente o privado ajeno,
409 quote/cantidad/version/idempotencia, 422 payload, 429 limite, 502/503 dependencia transitoria.
CORS permite origins exactos de Vercel y desarrollo, sin subruta y sin `*` en endpoints privados.
CORS no reemplaza autorizacion. OPTIONS no tiene efectos. Requests tienen limite de cuerpo
16 KiB, maximo 50 lineas, 99 unidades por linea, IDs validados y peticiones limitadas por usuario/IP.

JWT se valida mediante Supabase antes de cualquier acceso privilegiado. Nunca aceptar
`userId`, importe final, moneda arbitraria ni estado de pago del cliente como autoridad.
Catalog publico sin JWT usa gateway configurado para ello, rate-limit y parametros permitidos;
webhook sin JWT solo admite firma Mercado Pago valida. Ningun otro endpoint desactiva auth.

## Catalog

### GET /catalog/games

Publico, modo integrado. Query: `search` hasta 120 caracteres, `genre`/`platform` ID valido,
`ordering=name|-name|released|-released`, `page>=1`, `pageSize=20` (maximo 40).
Mapper upstream usa search/genres/platforms/ordering/page/page_size; dominio upstream fijo RAWG.
200: `{games:Game[],pagination:{page,pageSize,count,hasNext,hasPrevious},source:'rawg',requestId}`.
No devolver `next` upstream con key; no seguir URLs de origen suministradas por cliente.
Timeout y 3 intentos maximo en la capa servidor; navegador no multiplica esos retries.
429 preserva Retry-After acotado; errores invalidos/credenciales no se reintentan.

### GET /catalog/games/{rawgId}

200: `{game:Game,offers:Offer[],requestId}`; Game definido en modelo. Oferta DTO publica:
`{id,rawgId,name,category,cover,edition,activationPlatform,activationRegion,currency,
regularPrice,salePrice,availableUnits,status,version}`. Solo metadata validada.
RAWG 404 -> 404; metadata faltante -> null/array vacio, no error inventado.

### GET /catalog/filters

200: `{genres:[{id,name}],platforms:[{id,name}],requestId}` normalizados y cacheables.
IDs/etiquetas provienen del proveedor; no inferir que una plataforma equivale a oferta activable.

### GET /catalog/offers

200: `{offers:Offer[],publishedAt,requestId}` de Postgres, sin datos privados.
Si version difiere del JSON local, integrado usa valores servidor y requiere nueva aceptacion
para compra. Pages nunca llama a este endpoint: carga su JSON por BASE_URL.

## Auth provider boundary

Supabase JS SDK: signUp, signInWithPassword, resetPasswordForEmail, exchangeCodeForSession,
updateUser para recovery, signOut y onAuthStateChange. No endpoint propio de contrasenas.
Email/password van por HTTPS a Supabase; no pasan por logs ni Edge checkout.
Usar solo publishable key en SPA; secretos SMTP/administrativos quedan en proveedor/backend.
Allowlist callbacks exactos raiz Vercel/development. Verificacion de correo requerida para checkout.

## Quote

### POST /checkout/quotes

Auth requerida. Body: `{items:[{offerId,quantity}]}`. Server valida payload, ofertas y precio,
y crea quote TTL 5 min sin reservar. 201:
`{quote:{id,lines:[{offerId,offerVersion,name,edition,activationPlatform,activationRegion,
quantity,unitPrice,lineTotal}],currency:'CLP',subtotal,fees:0,total,expiresAt},requestId}`.
409 `OFFER_UNAVAILABLE`/`OFFER_INCOMPLETE`/`QUANTITY_UNAVAILABLE`; 422 `NON_PAYABLE_ITEM` para cero.
Cliente no puede cambiar quote; se acepta por ID al confirmar. No side effects por consulta de oferta.

## Checkout preference

### POST /checkout/preferences

Auth requerida. Header `Idempotency-Key`: UUID por confirmacion. Body:
`{quoteId,contact:{email},accepted:true}`; email debe coincidir con cuenta verificada.
No recoger direccion postal para bienes digitales ni enviar PII adicional al proveedor.
Validar quote owner, TTL, versiones y disponibilidad en transaccion; crear orden y reservar
unidades demo; bloquear intento y registrar hash antes de llamar al proveedor.

201 nuevo, 200 replay listo:
`{orderId,attemptId,status:'awaiting_payment',checkoutUrl,environment:'sandbox',requestId}`.
202 creacion incierta:
`{orderId,attemptId,status:'pending',code:'PREFERENCE_CREATION_UNKNOWN',requestId}`;
no checkoutUrl inventada y no retry ciego. GET orders consulta avance.
409 `QUOTE_EXPIRED`/`OFFER_CHANGED` requiere quote nuevo y aceptacion;
409 `IDEMPOTENCY_CONFLICT` si clave reutilizada con otro payload;
409 `ATTEMPT_ACTIVE` impide otra preferencia para mismo quote/pedido.
Una preferencia fallida antes de efectos comprobables puede liberar reserva por transaccion.
Resultado incierto conserva reserva y solicita reconciliacion/revision operativa.

Server usa `POST https://api.mercadopago.com/checkout/preferences`, token del vendedor prueba,
items con SKU, cantidad, titulo, CLP y precio servidor, `external_reference=orderId`,
notification_url del webhook HTTPS y back_urls raiz Vercel con orderId y payment=return.
Proveedor devuelve ID y URL de pruebas de la integracion; validar host HTTPS contra
allowlist oficial, no elegir URL recibida del visitante ni confiar en el prefijo del token.
La preferencia alojada puede permitir reintentos del comprador: reconciliar pagos asociados;
idempotencia propia no permite prometer que el proveedor nunca produzca un segundo payment ID.
Segundo pago aprobado para orden ya aprobada se registra como incidente y no repite efectos.

## Orders and reconciliation

### GET /orders/{orderId}

Auth y owner requeridos. 200:
`{order:{id,status,environment:'sandbox',currency:'CLP',subtotal,fees,total,
lines,createdAt,updatedAt},attempt:{state},requestId}`. Sin credenciales del proveedor.
404 para pedido ajeno. Query de retorno no altera estado. Efectos de pago no se aplican en GET.
Order pending se actualiza via webhook y reconciliacion; frontend polling acotado segun UI contract.

### POST /reconcile-payments

Solo scheduler/operador autenticado servidor; no publishable key ni JWT de comprador.
Procesa receipts retryables y pagos pendientes con bloqueo por pedido, obtiene estado actual
y valida todos los invariantes. No expone una lista de pedidos al navegador.
Instalar scheduler durable con clave privilegiada solo en secret store.
Creation_unknown sin ID requiere reconciliacion documentada disponible o revision manual;
no afirmar que existe una API de busqueda de preferencias no comprobada.

## Mercado Pago webhook

### POST /payment-webhook

Sin JWT Supabase; autenticar con `x-signature`, `x-request-id` y secreto del webhook.
HMAC-SHA256 de manifiesto oficial:
`id:<data.id>;request-id:<x-request-id>;ts:<ts>;` segun reglas actuales del proveedor
para ausencias/normalizacion. Implementar validador probado contra fixtures oficiales,
timestamp coherente y comparacion constante; no sustituirlo por un bearer publico.
400 payload/firma faltante, 401 firma invalida. Recibo valido se guarda durablemente antes
de 200/201; duplicado exacto devuelve 200 sin repetir efectos. Si falla persistencia, 503.
Ack en menos de 22 s, evitando operaciones externas largas antes del recibo durable.

Handler/worker consulta `GET https://api.mercadopago.com/v1/payments/{paymentId}` con
token servidor y valida: `external_reference`, pedido existente, `collector_id` esperado,
importe total exacto, CLP, `live_mode=false` y estado autoritativo. Referencia ajena o
importe distinto -> review_required, nunca approved. No consultar URLs arbitrarias del body.
`approved -> approved`, `pending|in_process|authorized -> pending`, `rejected -> rejected`,
`cancelled -> cancelled`; desconocidos/refunded/charged_back -> revision operativa.
Timestamp/version autoritativos evitan degradar aprobado por evento viejo.
Una transaccion registra pago, pedido y reserva; unicidad previene repetir efectos.
Worker tiene reintentos durables; no confiar en trabajo fire-and-forget tras retornar de Edge.

## Security and contract tests

- Precio/usuario/currency adulterados no cambian quote/pedido.
- JWT expirado, owner ajeno y navegador intentando escribir estado son denegados.
- Retorno falsificado nunca aprueba; payment con live_mode=true lleva a rechazo/revision.
- Webhook falso, repetido y desordenado no modifica ni duplica efectos.
- Timeout entre creacion remota/persistencia no llama de nuevo a preferencias a ciegas.
- Dos preferencias concurrentes para mismo quote producen una orden y un intento activo.
- Supabase RLS/SQL se prueba en Postgres real; fixtures HTTP no sustituyen esa evidencia.
- Secrets ausentes bloquean checkout, no activan modo demo silenciosamente en integrado.
