# Research: Q Brands game store

**Date**: 2026-10-02. Investigacion documental y lecturas dirigidas, sin provisionamiento.

## 1. Identity and persistence

**Decision**: Supabase Auth por correo/contrasena, registro con confirmacion, recuperacion
y sesion del SDK; Postgres con RLS y Edge Functions para operaciones confiables.
**Rationale**: Resuelve acceso real y autorizacion de pedidos sin desarrollar un servidor de
contrasenas. Usuario propietario inferido del JWT validado, nunca del cuerpo de la peticion.
**Alternatives considered**: Firebase (otra plataforma y modelo), Auth0 + DB separada
(mas componentes), login local (no satisface FR-009).

Clave publishable y URL pueden estar en navegador, pero no `service_role`/secret key.
Usar PKCE y callbacks en raiz `/?auth=callback` y `/?auth=recovery`, allowlist exacta
para desarrollo y Vercel. Flujo requiere mismo navegador/dispositivo; errores de codigo
vencido o verifier perdido permiten reiniciar, no dan por autenticado al usuario.
SMTP por defecto no habilita correo publico fiable: preparar SMTP verificado, limites y
proteccion de abuso. Logout elimina vistas/datos privados antes de otro usuario.

Sources: [Auth/passwords](https://supabase.com/docs/guides/auth/passwords),
[redirects](https://supabase.com/docs/guides/auth/redirect-urls),
[PKCE](https://supabase.com/docs/guides/auth/sessions/pkce-flow),
[SMTP](https://supabase.com/docs/guides/auth/auth-smtp),
[API keys](https://supabase.com/docs/guides/api/api-keys),
[RLS](https://supabase.com/docs/guides/database/postgres/row-level-security).

## 2. Gateway and CLP

**Decision**: Mercado Pago Checkout Pro, Preferences API del vendedor de pruebas Chile,
CLP, redireccion a checkout alojado y verificacion servidor. No checkout de tarjetas propio.
**Rationale**: Compatible con el mercado/moneda definidos y escenario sandbox elegido.
**Alternatives considered**: simulacion local (rechazada por usuario), Stripe (necesitaria
validar elegibilidad comercial/moneda del vendedor), cobros productivos (fuera de alcance).

Vendedor y comprador de pruebas diferentes, ambos Chile. Supabase autentica personas
reales para la app; Mercado Pago usa comprador ficticio para el pago, sin confundir identidades.
Access token de pruebas no se reconoce solo por prefijo: Checkout Pro puede usar `APP_USR`.
En startup validar procedencia/vendedor; backend acepta pagos solo con `live_mode=false`.
Tarjetas exclusivamente de prueba. Mostrar estado de prueba antes y despues de redirigir.
Productos gratuitos: mostrar acceso/enlace oficial, no enviarlos al checkout ni inventar precios.
No producir pedidos pagados gratis o claves reales dentro del alcance actual.

Sources: [preference](https://www.mercadopago.cl/developers/es/docs/checkout-pro-preferences/create-payment-preference),
[accounts](https://www.mercadopago.cl/developers/es/docs/checkout-pro-preferences/test-accounts),
[test purchases](https://www.mercadopago.cl/developers/es/docs/checkout-pro-preferences/integration-test/test-purchases),
[API](https://www.mercadopago.cl/developers/es/reference/online-payments/checkout-pro-preferences/create-preference/post).

## 3. Authoritative confirmation and retries

**Decision**: Servidor crea quote/pedido/preferencia, valida webhook y consulta el pago
por ID; transaccion registra cambios una vez. El retorno de navegador nunca autoriza.
**Rationale**: Previene importes manipulados, estados falsos y duplicacion por recarga.
**Alternatives considered**: aceptar `status=approved` en URL, confiar en precios cliente
o usar solo `external_reference` como idempotencia: rechazadas por FR-012/014.

`Idempotency-Key` propio: unico por usuario, huella del payload y respuesta persistida.
La API de preferencias consultada no acredita idempotencia del proveedor. Si un timeout
deja creacion remota incierta, bloquear otra creacion automatica: guardar `creation_unknown`
y reconciliar por referencia mediante API documentada disponible o revision operativa.
No inventar un endpoint para buscar preferencias ni recrearlas a ciegas.
Ordenes tienen un intento activo; bloquear reintentos de pago pendiente/desconocido.

Firma webhook: `x-signature`/`x-request-id`, HMAC-SHA256 con secreto de webhook y manifiesto
documentado, comparacion constante. Validar timestamp y replay sin invalidar retries legitimos.
Consultar `/v1/payments/{id}` y comprobar referencia, vendedor, importe, CLP y modo prueba.
Registrar durablemente antes de responder 200/201; eventos repetidos/desordenados se deduplican
por identidad de evento, no por payment ID solamente. Reconciliacion durable/scheduled
para pendientes y fallos transitorios; una aprobacion no se degrada por evento viejo.

Sources: [webhooks](https://www.mercadopago.cl/developers/es/docs/checkout-pro-preferences/additional-content/notifications/webhooks),
[returns](https://www.mercadopago.cl/developers/es/docs/checkout-pro-preferences/configure-back-urls),
[Edge auth](https://supabase.com/docs/guides/functions/auth).

## 4. Catalog and existing contracts

**Decision**: JSON local conserva ofertas y SKU legacy; asociar `rawgId` verificado.
Proxy backend integrado normaliza RAWG sin filtrar sus claves/URLs upstream a navegador.
Publicacion confiable importa ofertas JSON a Postgres; checkout lee solo Postgres.
**Rationale**: RAWG no entrega precios, inventario ni derechos de venta. El cliente no
puede ser fuente autoritativa del importe, aunque preserve la fuente JSON del proyecto.
**Alternatives considered**: precio inventado por ID, matching solo por nombre,
leer JSON cliente en checkout: rechazados por integridad.

RAWG `/games` devuelve count/next/previous/results; devolver pagina y flags sanitizados.
Orden `name`/`released` y descendentes, genero/plataforma/busqueda upstream; no ordenar por
precio un universo RAWG sin ofertas. Catalogo local mantiene sus categorias de S6/S7.
`useEffect` cancela peticiones, useState conserva ultimo estado; debounce 300 ms, page_size 20,
retry solo red, 408, 429 y 5xx transitorios con backoff acotado/Retry-After; no retry de
JSON malformado, 401/403 ni AbortError. No cachear informacion privada con catalogo publico.
Respuesta faltante usa valores null/alternativas, nunca metadata inventada.

Sources: [RAWG OpenAPI](https://api.rawg.io/docs/?format=openapi),
[RAWG terms/plans](https://rawg.io/apidocs),
[catalogApi](../../src/services/catalogApi.js), [useCatalog](../../src/hooks/useCatalog.js).
Revalidar licencia comercial/cuota antes de puesta en servicio; los planes pueden cambiar.
Atribucion con enlace activo en toda vista que emplee metadata/imagenes RAWG.

## 5. S8 and previous weeks

**Decision**: Mantener CartContext, reducer puro y `qBrandsCart`; sustituir el hook de
almacenamiento `useReducer` por `useState` con setter funcional que aplica cartReducer.
**Rationale**: La constitucion exige el limite contexto/reducer, no un hook particular.
Cumple S8 literalmente sin duplicar items y preserva transiciones y API publica.
**Alternatives considered**: dos carritos en useState/useReducer (divergencia), omitir
useState del carrito (riesgo literal de pauta), eliminar reducer (viola gobernanza).

Demostrar useState en catalogo/carrito/formularios; useEffect en carga/cancelacion/auth y
persistencia; condicionales en empty/loading/error/seleccion/sesion/pago. Comentarios
breves en bloques complejos exigidos por S8, sin narrar asignaciones triviales.
Historial documentado en spec: S6 interacciones; S7 componentes, CLP, carga y Pages.
No copiar el ejemplo de administracion del catalogo de la guia: no es objetivo comercial.

Sources: [instrucciones S8](../../docs/s8%20docs/PFY2201_Exp3_S8_Instrucciones_especificas%20%28forma%20A%29.md),
[pauta S8](../../docs/s8%20docs/PFY2201_Exp3_S8_Pauta_de_evaluacion_sumativa.md),
[constitucion](../../.specify/memory/constitution.md), [CartContext](../../src/context/CartContext.jsx).

## 6. Two approved build targets

**Decision**: Pages academico sin login/pagos ni credenciales; enlace al flujo Vercel
integrado. El usuario aprobo expresamente la separacion durante este comando.
**Rationale**: Pages limita ecommerce y transacciones sensibles; no asumir excepcion por sandbox.
**Alternatives considered**: login real en Pages (riesgo de politica), eliminar Pages
(incumple S8), migrar toda la app a otro framework (innecesario).

Build target explicito `VITE_APP_MODE=academic|integrated`, base independiente de CI.
Academic carga JSON, carrito y estados; no muestra formulario de credenciales ni autoriza
pedidos locales como pagados. Integrado Vercel usa Supabase y pasarela de pruebas.
Publicacion `gh-pages` con dist para pauta literal; no confundirla con la fuente `s8`.
El workflow actual escucha s7 y usa base ligada a GITHUB_ACTIONS: ajustar en implementacion,
no asumir que ejecutar Actions equivale a destino Pages. Callbacks/retornos a raiz con query.

Sources: [Pages limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits),
[Vite deployment](https://vite.dev/guide/static-deploy.html),
[Vite env](https://vite.dev/guide/env-and-mode),
[workflow](../../.github/workflows/deploy-pages.yml), [Vite config](../../vite.config.js).

## Research completion

Decisiones tecnicas resueltas. Cuentas, SMTP, dominios, tokens, licencia RAWG e IDs verificados
son requisitos operativos enumerados en el plan. No se configura ninguno aqui ni se promete
una prueba real sin ellos. Gates constitucionales PASS de diseno; evidencia de ejecucion futura.
