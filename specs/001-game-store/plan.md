# Implementation Plan: Q Brands - Tienda de juegos con acceso y compra

**Branch**: `s8` | **Date**: 2026-10-02 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/001-game-store/spec.md`.

**Note**: El script infiere `001-game-store`; Git confirma `s8` como rama real.
Este comando solo genera diseno. No instala dependencias, provisiona ni despliega servicios.

## Summary

Evolucionar la SPA existente con descubrimiento RAWG, ofertas propias, carrito persistente,
Supabase Auth real y Mercado Pago Checkout Pro de Chile exclusivamente en pruebas.
Supabase Postgres y Edge Functions conservan precios autoritativos, pedidos y resultados.
El usuario aprueba dos destinos: Pages para demostracion academica sin credenciales y Vercel
para el flujo integrado. Ambos reutilizan componentes; no se construye otra tienda.

## Technical Context

**Language/Version**: JavaScript ES modules/JSX existente; React 19.2, Vite 8.3.
Node 22.12+ en CI compatible con Vite; local observado 26.8.1. Edge Functions en TypeScript/Deno
gestionado por Supabase; fijar versiones compatibles en el lockfile al implementar.

**Primary Dependencies**: React DOM, Bootstrap 5.3, animate.js y React Compiler existentes.
Agregar `@supabase/supabase-js` para identidad; Vitest, Testing Library y Playwright para pruebas.
Mercado Pago por REST server-side y redireccion alojada, sin SDK de tarjetas ni router nuevo.

**Storage**: JSON local de ofertas conservado; publicacion validada a Postgres para precios
de checkout. Postgres con RLS para pedidos/intentos. `qBrandsCart` en localStorage migrable.
Sesiones gestionadas por Supabase SDK; no almacenar contrasenas ni datos de tarjeta propios.

**Testing**: Vitest/Testing Library para UI, reducer y adaptadores; Deno test para funciones;
Supabase local con Docker para SQL/RLS; Playwright para recorridos y screenshots.
Suites reales de proveedores separadas de fixtures; ningun mock acredita un pago integrado.

**Target Platform**: Navegadores actuales, 360 y 1280 px. Pages con subruta existente
`/DF_I-Fundamentos_HTML_CSS/`, Vercel con raiz `/`; Supabase HTTPS para auth y backend.

**Project Type**: SPA existente con backend gestionado minimo, un vendedor, solo sandbox.

**Performance Goals**: SC-001: 9/10 descubrimientos en menos de 60 s; SC-004: compra en
menos de 3 min sin esperas externas. Busqueda con debounce de 300 ms, 20 juegos/pagina;
3 intentos maximo para fallos transitorios y timeout de 10 s por intento de catalogo.

**Constraints**: CLP entero, pagos positivos, sin claves de activacion ni cobros reales.
Claves privilegiadas solo en backend. Callback a raiz con query, no rutas que dependan de rewrites.
No duplicar estado del carrito ni reemplazar Bootstrap/React Compiler.

**Scale/Scope**: 21 productos locales como antecedente; enriquecimiento por IDs verificados,
exploracion paginada de RAWG, cuenta, carrito, revision y resultado de pedido.
Sin vendedores externos, administracion completa, multi-moneda ni inventario real.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principio | Gate previo a investigacion | Gate posterior al diseno |
| --- | --- | --- |
| I. Propiedad declarativa | PASS: conservar componentes, contexto y funcion reducer | PASS: `useState(prev => cartReducer(prev, action))` aplica transiciones; contexto sigue siendo unico owner |
| II. Catalogo independiente | PASS: JSON conservado; RAWG separado de precios | PASS: servicio normaliza RAWG; JSON publica ofertas a servidor por proceso confiable |
| III. Accesibilidad/movimiento | PASS: no sustituir interacciones accesibles | PASS: teclado, foco, estados anunciados y reduced-motion son gates de navegador |
| IV. Integridad/validacion | PASS: API de carrito y clave `qBrandsCart` preservadas | PASS: migracion validada, calculos compartidos, formulario nativo y confirmacion autoritativa |
| V. Cambios verificados | PASS: alcance limitado y dependencias justificadas | PASS: pruebas por modulo, lint/build y evidencia de integraciones antes de entregar |
| Restricciones tecnicas | PASS: React/Vite/Bootstrap continúan | PASS: SPA intacta; backend solo cubre secretos, identidad, autorizacion y pagos |

La constitucion exige un limite de contexto/reducer, no el hook `useReducer` especifico.
Cambiar solo el mecanismo de estado a `useState` mantiene la funcion pura y la API existente,
cubre literalmente S8 y evita una enmienda o dos copias del carrito. Probar equivalencia antes
de ampliar sus acciones. La fecha de ratificacion pendiente no altera los principios vigentes.

## Project Structure

### Documentation (this feature)

```text
specs/001-game-store/
  spec.md
  plan.md
  research.md
  data-model.md
  quickstart.md
  checklists/requirements.md
  contracts/storefront.md
  contracts/backend.md
```

`tasks.md` se generara exclusivamente con `/speckit-tasks`.

### Source Code (repository root)

Estructura objetivo; las adiciones siguientes NO se crean en la fase de plan:

```text
public/data/products.json
src/
  App.jsx
  components/          # componentes existentes + detalle, acceso y resultado
  context/             # CartProvider y AuthProvider; reducer puro compartido
  hooks/               # catalogo, carrito, sesion y pedido
  services/            # catalogApi, identidad y checkout
  utils/               # moneda y validacion compartida cuando corresponda
supabase/
  migrations/          # ofertas, pedidos, idempotencia, RLS y transacciones
  functions/
    catalog/
    checkout/
    orders/
    payment-webhook/
    reconcile-payments/
    _shared/
tests/
  unit/
  integration/
  e2e/
.github/workflows/deploy-pages.yml
vite.config.js
```

**Structure Decision**: No mover la SPA a otra carpeta ni introducir un backend Express.
Edge Functions forman el unico limite servidor; compartir validaciones puras solo si evita
divergencia real. La prueba y el componente se organizan con helpers reutilizados.

## Complexity Tracking

Sin desviaciones constitucionales. Supabase y el limite servidor son necesarios para login
real, RLS, precios confiables y secretos; una SPA exclusivamente estatica no puede verificar
pagos. Dos destinos usan el mismo codigo con capacidades de build distintas, por la politica
de Pages y la entrega academica aprobada por el usuario.

## Phase 0 - Research

[research.md](research.md) resuelve identidad, pasarela/CLP, fuentes de precios, seguridad,
idempotencia, continuidad S6/S7, S8 y hosting. Requisitos operativos son gates de ejecucion,
no decisiones de arquitectura sin resolver. No queda `NEEDS CLARIFICATION` pendiente.

## Phase 1 - Design

Modelo: [data-model.md](data-model.md). Interfaces:
[storefront.md](contracts/storefront.md) y [backend.md](contracts/backend.md).
Validacion ejecutable tras implementar: [quickstart.md](quickstart.md).

Orden de implementacion a descomponer posteriormente: asegurar pruebas de regresion y
estado S8; enriquecer/migrar ofertas y carrito; desplegar schema/RLS y auth;
implementar checkout/idempotencia/webhook/reconciliacion; terminar UI accesible;
validar servicios reales de prueba y publicar las dos variantes. No crear tareas aqui.

### Requirement Coverage

| Requisitos | Superficie responsable | Evidencia prevista |
| --- | --- | --- |
| FR-001, FR-002, FR-004, FR-005 | catalogApi, useCatalog, proxy RAWG y fichas | filtros globales, paginacion, errores, atribucion y ultimo resultado |
| FR-003 | JSON de ofertas + publicacion Postgres | asociaciones verificadas, oferta completa, sin compra de metadata sola |
| FR-006, FR-007, FR-008 | contexto/reducer, useState y controles | operaciones, total, migracion, reload y condicionales |
| FR-009, FR-014 | AuthProvider, Supabase Auth y RLS | registro/recovery, expiracion, logout, aislamiento entre dos usuarios |
| FR-010, FR-011, FR-012, FR-013 | checkout, orders, webhook y reconciliacion | importe validado, sandbox real, retorno falsificado y duplicaciones |
| FR-015, FR-016 | componentes Bootstrap y utilidades existentes | teclado, dos viewports, reduced-motion y regresion S6/S7 |
| FR-017 | builds Pages/Vercel y evidencias | URLs publicas, subruta, dist y 3 grupos de capturas |

### S8 Assessment Coverage

| Criterio/puntos | Aplicacion concreta | Gate de entrega |
| --- | --- | --- |
| useState / 25 | catalogo; lineas del carrito actualizadas funcionalmente via reducer; formularios y filtros | demostrar actualizaciones y ausencia de estado duplicado |
| useEffect / 20 | fetch del JSON/RAWG, cancelacion, suscripcion auth y persistencia | demostrar carga dinamica y limpieza bajo StrictMode |
| Renderizado condicional / 20 | loading/error/empty; carrito; agregado; sesion y resultado | capturas reproducibles y pruebas de cada estado |
| Organizacion / 15 | limites existentes, servicios y helpers; comentarios breves solo en bloques no evidentes | revision de reutilizacion, claridad y comentarios pedidos por S8 |
| Publicacion / 20 | rama gh-pages con dist academico, URL Pages y enlace a Vercel | accesibilidad publica y rutas/assets verificados |

Mantener busqueda, categorias, destacados, CLP y persistencia de S6/S7. El workflow actual
usa Pages Actions desde `s7`; al implementar ajustar a S8 y publicar `dist` en `gh-pages`
para cumplir la pauta literal. No escribir fuente ni secretos en esa rama de salida.
Las credenciales y el checkout integrado NO estaran disponibles en el build Pages.

## Testing Strategy

**appType**: mixed (SPA y funciones HTTP). **primaryValidationStack**: Vitest/Testing
Library + Deno test + Supabase local/Docker para SQL y RLS + Playwright Chromium.
No hay comando `test` ni assets de tests existentes; crear `npm test` como entrada canonica
para unit/contratos, `npm run test:integration` para backend y `npm run test:e2e` para navegador.
CI debe ejecutar las tres suites ademas de `npm run lint` y `npm run build` para ambos modos.

**legacyTestAssets**: busqueda de `*.test.*`/`*.spec.*` sin resultados; no hay suites a migrar.
Las evidencias e historial previos no sustituyen tests. No se han ejecutado tests de aplicacion
durante este comando de diseno ni se afirma un baseline verde.

Recorridos criticos: descubrimiento/ficha; operaciones/migracion del carrito;
registro/acceso/recovery/logout; pago sandbox con todos los estados;
fraude de retorno/importe/usuario, reintento y publicacion de ambas variantes.

| Capacidad | Disponible observado | Fallback si falla al ejecutar | Brecha |
| --- | --- | --- | --- |
| Infra | Docker daemon 29.7.2 | proyecto Supabase de pruebas dedicado | requiere credenciales/red; mocks no prueban RLS |
| Navegador | Node 26.8.1; binarios Playwright no verificados | pruebas HTTP y UI aisladas | no acredita layout, navegacion ni accesibilidad; entrega bloqueada |
| Funciones | Deno no instalado | runtime local de Supabase CLI/Docker o instalar Deno | ejecutar tests es requisito, no omitir por ausencia de CLI |
| Proveedores | cuentas y SMTP no configurados por este comando | fixtures para trabajo local | no acredita login/recovery ni pagos integrados; gate final bloqueado |

**External dependency strategy**: fixtures de RAWG y respuestas de pago en unit/contratos;
Auth/Postgres reales locales para RLS, transacciones e identidades distintas; proyectos remotos
dedicados para SMTP y Mercado Pago sandbox. Contract tests del frontend consumen fixtures
del contrato HTTP y los tests de funciones producen ese mismo formato. No SQLite para afirmar
conformidad de RLS Postgres. Limitar logs a IDs y codigos, nunca tokens ni PII.

**Infrastructure**: helpers comunes de catalogo/carrito, dos identidades y pedidos UUID;
rollback/cleanup y vendedor sandbox aislado. Crear tests de arranque para catalog, checkout,
orders, webhook y reconciliacion. Tests por tarea con conteos pass/fail/skip; fallo significa
tarea incompleta. Correo y credenciales se configuran fuera del repo y del chat.

**Acceptance/review**: verificar SC-001 a SC-008, evidencias de 360/1280 px y reduced-motion,
RLS denegando lectura ajena y escritura de importes, rechazo de `live_mode=true`, webhook
falso/repetido/desordenado, retiro parcial del carrito y retorno que no autoriza por URL.
Cada fallback debe conservar su brecha en el reporte; no certificar E2E real con fixtures.

## Execution Prerequisites

- Proyecto Supabase de pruebas, SMTP verificado, URLs de retorno y politicas RLS desplegadas.
- App Mercado Pago Chile con vendedor/comprador de pruebas distintos, access token de ese
  vendedor y secreto webhook; no instalar credenciales productivas. Validar cuenta y modo.
- RAWG key y licencia/cuota vigentes; key solo servidor integrado, nunca build Pages.
- IDs de juegos y metadatos de oferta revisados antes de importar a Postgres; incompletos no vendibles.
- URLs exactas de Vercel y Pages, y autorizacion para publicar. No provisionar en esta fase.
- Instalacion de herramientas de tests en implementacion; verificar Chromium y Supabase CLI.

Estos gates estan disenados, no ejecutados. El plan esta completo; la entrega integrada
no puede declararse aprobada hasta cumplirlos.
