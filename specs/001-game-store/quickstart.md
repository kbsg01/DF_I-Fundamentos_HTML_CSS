# Quickstart Validation Guide

**Date**: 2026-10-02. Guia para ejecutar DESPUES de implementar; no acredita integracion actual.
**Related**: [plan](plan.md), [data model](data-model.md),
[storefront](contracts/storefront.md), [backend](contracts/backend.md).

## Prerequisites

- Node compatible con Vite (22.12+), npm, Docker operativo y Supabase CLI.
- Deno para tests de funciones, o runtime de tests compatible via entorno Supabase local.
- Chromium Playwright instalado en implementacion.
- Proyecto Supabase de pruebas con migraciones/RLS y SMTP verificado para correos publicos.
- App Mercado Pago Chile: vendedor y comprador de pruebas diferentes; tarjetas oficiales de
  prueba, access token del vendedor prueba y secreto webhook. Nunca cuentas/tarjetas productivas.
- RAWG key y licencia/cuota confirmadas. No pegar credenciales en el chat ni versionarlas.
- Vercel integrado y Pages academico configurados cuando llegue la fase de publicacion.

Observado al planificar: Node 26.8.1, Docker daemon 29.7.2; Deno ausente, Chromium/Supabase
CLI no verificados. No hay suites previas ni scripts de tests en el package actual.
La implementacion debe agregar los scripts siguientes antes de ejecutar esta guia.

## Configuration boundaries

Publico integrado: `VITE_APP_MODE=integrated`, `VITE_BASE_PATH=/`,
`VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`.
Publico academico: `VITE_APP_MODE=academic`,
`VITE_BASE_PATH=/DF_I-Fundamentos_HTML_CSS/`, `VITE_INTEGRATED_APP_URL` HTTPS aprobado.
No incluir claves de Supabase/RAWG/pagos en el build academico.

Solo backend: RAWG_API_KEY, credencial Supabase privilegiada del runtime,
MP_ACCESS_TOKEN del vendedor prueba, MP_WEBHOOK_SECRET, MP_TEST_COLLECTOR_ID,
APP_ORIGIN y ALLOWED_ORIGINS con origins exactos. SMTP se configura en Supabase.
Variable `VITE_*` es publica aunque proceda de un secret de CI.
Registrar callbacks auth/recovery y retornos pago a la raiz de Vercel.
Separar proyectos/datos test de produccion, sin importar pedidos reales.

## Local validation commands

Desde la raiz del repo, en PowerShell. Estos comandos usan scripts y configuracion que se
crearan en implementacion; no ejecutarlos ahora para afirmar un resultado inexistente.

```powershell
npm ci
npx supabase start
npx supabase db reset
npx supabase functions serve --env-file .env.backend.local
```

El reset anterior SOLO sobre el entorno local desechable; nunca reset remoto. La configuracion
de funciones debe permitir catalog publico/webhook sin JWT de gateway y mantener validacion
JWT en endpoints privados. No pasar `--no-verify-jwt` global indiscriminadamente.
Preparar datos de test aislados por UUID y publicar ofertas verificadas desde JSON con el
proceso confiable previsto en tareas; el navegador no escribe precios.

En otra terminal, con variables locales configuradas fuera del control de versiones:

```powershell
npm test -- --run
npm run test:integration
npx playwright install chromium
npm run test:e2e
npm run lint
$env:VITE_APP_MODE = 'integrated'
$env:VITE_BASE_PATH = '/'
npm run build
npm run preview -- --port 4173
```

Tests e2e deben configurar webServer de Playwright y evitar depender de un servidor olvidado.
La preview manual sirve el build actual; no confundirla con el resultado del test.
Build academico se valida por separado, sin claves privadas/publicas de integracion presentes:

```powershell
$env:VITE_APP_MODE = 'academic'
$env:VITE_BASE_PATH = '/DF_I-Fundamentos_HTML_CSS/'
npm run build
npm run preview -- --port 4174
```

Comprobar URL `http://localhost:4174/DF_I-Fundamentos_HTML_CSS/`, JSON y assets.
Preview integrado previo debe detenerse antes de sobrescribir dist; conservar resultados
de ambos builds separados si se necesitan a la vez.

## Offline/deterministic checks

1. Catalogo: fixture paginado RAWG con titulos conocidos, filtros, imagen ausente y 429;
   comprobar normalizacion, timeout/retry, cancelacion y que ultima busqueda gana.
2. Carrito: agregar/cambiar/eliminar/vaciar, cantidades invalidas, free/incomplete, legacy
   qBrandsCart y JSON roto; contador/total exactos y misma API antes/despues de useState.
3. Auth UI: initializing/anonymous/authenticated/expired y recovery invalido;
   fixtures verifican vistas, NO acreditan autenticacion real.
4. Backend con Postgres local: dos usuarios, RLS, importe adulterado, quote vencido,
   reserva concurrente, idempotencia mismo/diferente payload y creacion remota incierta.
5. Webhook: firma valida/invalida, eventos repetidos/desordenados, monto/collector/currency
   incorrectos y live_mode=true. Retorno manipulado no cambia estado; efectos exactamente una vez.
6. Navegador: 360/1280 px, teclado, foco, reduced-motion, empty/error/loading y screenshot.
   Sin scroll horizontal, PII, imagenes rotas inesperadas ni errores de consola.

## Real integrations in test environment

1. Registrar cuenta real de Supabase, confirmar email y entrar. Repetir recovery en el
   mismo navegador PKCE; logout/expiracion y segunda cuenta no revelan pedidos ajenos.
   Correo publico requiere SMTP: marcar BLOCKED si no llega; no reemplazar con usuario ficticio.
2. Consultar RAWG real con key servidor, filtros y detalle. Atribucion visible; ningun
   request/browser asset/log contiene key privilegiada ni next upstream con key.
3. Cotizar productos pagables, aceptar CLP y crear una preferencia del vendedor prueba.
   Abrir checkout con comprador ficticio chileno en sesion separada de cuenta productiva.
   No usar tarjetas reales; usar datos oficiales vigentes para aprobado/pendiente/rechazado.
4. Webhook publico HTTPS de Supabase recibe/valida evento, obtiene payment actual y
   guarda live_mode=false. Comprobar ID de pedido, snapshot, importe y resultado del proveedor.
5. Cancelar/regresar, cerrar pestana, recargar y repetir confirmacion. No crear otra
   preferencia cuando resultado es desconocido; registrar incidente si proveedor genera pagos multiples.
6. Probar interrupcion del handler y reconciliacion durable, y pedidos pending sin retorno.
   Si proveedor no ofrece un escenario determinista, mantener el caso contractual y documentar
   el gap del caso real; no falsificar una respuesta para afirmar aprobacion sandbox.

## Publication and S8 evidence

No desplegar por esta guia durante planificacion. En implementacion, con autorizacion:
publicar dist academico en gh-pages/Pages y build integrado en Vercel; backend en Supabase.
Actualizar el workflow que hoy escucha s7 y la base que hoy depende de GITHUB_ACTIONS.
Verificar URLs reales, enlace Pages -> Vercel, callbacks, JSON, assets y refresh de raiz.
Pages debe funcionar sin credenciales y nunca ofrecer login/tarjeta propia.

Evidencias minimas: catalogo cargado dinamicamente; carrito agregado/eliminado; vista vacia
y otra condicion; acceso real y resultado de pago de prueba redaccionados para integrado.
Mostrar useState para catalogo/carrito/interacciones, useEffect de carga/persistencia y
renderizado condicional en la revision de codigo, con comentarios utiles y reutilizacion.
Reportar links del repo y ambos destinos; no copiar contenido protegido de las guias.

## Verdict criteria

- SC-001: cronometraje 10 recorridos, 9 bajo 60 s. SC-004: recorrido preparado bajo 3 min.
- SC-002/003/005/007: 100% de casos definidos pasan, sin datos ajenos ni compra falsa.
- SC-006: screenshots/teclado/movimiento reducido en ambos viewports.
- SC-008: todos los enlaces y los cinco criterios de S8 verificables.
- Reporte debe incluir comandos, entorno, conteos pass/fail/skip, evidencias y gaps.
- PASS integrado requiere SMTP, RAWG y pagos sandbox reales; fixtures solo dan PASS local.
  Falta de credenciales, navegador o proveedor -> BLOCKED para ese gate, nunca PASS silencioso.
- No habilitar produccion ni afirmar entrega de claves reales. Limpiar fixtures, usuarios y
  pedidos de pruebas con teardown acotado, sin borrar cambios o datos de otras personas.
