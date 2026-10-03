# Implementation Plan: Q Brands - Tienda de juegos con acceso y compra

**Branch**: `s8` | **Date**: 2026-10-02 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/001-game-store/spec.md`.

**Note**: El script infiere `001-game-store`; Git confirma `s8` como rama real.
Este comando solo genera diseno. No instala dependencias, provisiona ni despliega servicios.

## Summary

Evolucionar la SPA React/Vite existente como demo educativa autocontenida en servicios:
catalogo y ofertas ficticias desde JSON local, carrito persistente, perfil de acceso ficticio
y resultados de compra simulados. Publicar un solo build estatico en GitHub Pages. No conectar
RAWG, Supabase, Mercado Pago ni otros servicios; no recoger datos personales o de pago.

## Technical Context

**Language/Version**: JavaScript ES modules/JSX; React 19.2.8 y Vite 8.3.0 existentes.
Node 22.12+ compatible con Vite; Node 26.8.1 observado localmente.

**Primary Dependencies**: React DOM, Bootstrap 5.3, animate.js, React Compiler, Vitest,
Testing Library, jsdom y Playwright ya figuran en `package.json`. No agregar SDKs de servicios.
Retirar durante implementacion la dependencia/configuracion Supabase heredada tras verificar
que no existan imports activos.

**Storage**: `public/data/products.json` es el catalogo/ofertas de demostracion; `qBrandsCart`
en localStorage conserva el carrito con compatibilidad del formato existente. El perfil y el
comprobante ficticios viven solo en estado React; no se persisten cuentas ni transacciones.

**Testing**: Vitest/Testing Library para servicios locales, reducer/carrito y componentes;
Playwright Chromium para flujos a 360 y 1280 px; `npm run lint`, `npm run build` y preview.
No hay pruebas de integracion con servicios externos en este alcance.

**Target Platform**: Navegadores actuales y GitHub Pages como sitio estatico de proyecto,
con la subruta ya configurada `/DF_I-Fundamentos_HTML_CSS/`.

**Project Type**: SPA React/Vite, exclusivamente cliente y estaticamente publicada.

**Performance Goals**: SC-001: al menos 9/10 recorridos de descubrimiento bajo 60 s;
SC-004: acceso, revision y resultado simulados bajo 3 min. El catalogo local debe mostrar
estados de carga/error/recuperacion sin bloquear el carrito.

**Constraints**: CLP entero; sin autenticacion, APIs, backend, pedidos, cobros, contrasenas,
datos de tarjeta, secretos ni entrega de claves reales. Mantener React, Bootstrap, el contrato
del carrito y el base path de Pages. La demo debe identificar acceso/resultados como ficticios.

**Scale/Scope**: Un catalogo local pequeno (21 entradas actuales), un visitante por navegador,
carrito persistente y simulacion de acceso/compra. Sin inventario real, vendedores externos,
administracion, multi-moneda ni comunicacion con proveedores.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principio | Gate previo a investigacion | Gate posterior al diseno |
| --- | --- | --- |
| I. Propiedad declarativa | PASS: conservar componentes, contexto y reducer del carrito | PASS: un solo CartContext aplica transiciones puras mediante setter funcional de `useState` |
| II. Catalogo independiente | PASS: mantener los datos fuera de la presentacion | PASS: `catalogApi` obtiene JSON local; cambios del schema se validan con todos sus consumidores |
| III. Accesibilidad/movimiento | PASS: preservar teclado, nombres accesibles y movimiento reducido | PASS: estados loading/error/empty y flujos se prueban en navegador |
| IV. Integridad/validacion | PASS: preservar `qBrandsCart`, calculos CLP y validacion nativa | PASS: el checkout valida el resumen y solo genera una salida ficticia, nunca una transaccion |
| V. Cambios verificados | PASS: reutilizar stack y dependencias ya instaladas | PASS: unit, E2E, lint, build y preview antes de publicar el artefacto |
| Restricciones tecnicas | PASS: React/Vite/Bootstrap existentes | PASS: SPA cliente sin backend, secretos ni integraciones de proveedores |

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
  context/             # CartProvider y reducer puro compartido
  hooks/               # catalogo, carrito y estado de demo
  services/            # catalogApi JSON local
  utils/               # moneda y validacion compartida cuando corresponda
tests/
  unit/
  e2e/
.github/workflows/deploy-pages.yml
vite.config.js
```

**Structure Decision**: Mantener la SPA y sus componentes actuales, sin backend ni carpetas
de proveedores. Extender `products.json`, `catalogApi`, `CartContext` y `Checkout` donde
corresponda; agregar pruebas bajo las carpetas Vitest/Playwright existentes.

## Complexity Tracking

No hay desviaciones constitucionales ni complejidad adicional aprobada. Eliminar del alcance
los artefactos heredados de Supabase, su SDK y el script de pruebas de integracion sin objetivo;
no reemplazarlos por otro backend o proveedor.

## Phase 0 - Research

[research.md](research.md) documenta catalogo local, limites de simulacion, persistencia,
S8 y hosting estatico. No quedan decisiones de arquitectura sin resolver ni requisitos de
cuentas, secretos o disponibilidad de proveedores.

## Phase 1 - Design

Modelo: [data-model.md](data-model.md). Contrato visible de la SPA:
[storefront.md](contracts/storefront.md). [backend.md](contracts/backend.md) registra que
no existe contrato backend en este alcance. Validacion: [quickstart.md](quickstart.md).

Orden para descomponer despues: pruebas de regresion/cart S8; schema local de demo y filtros;
perfil ficticio y checkout simulado con avisos; accesibilidad/E2E; limpieza de dependencias y
configuracion Supabase heredadas; build base-path, preview y publicacion Pages autorizada.
No crear tareas aqui.

### Requirement Coverage

| Requisitos | Superficie responsable | Evidencia prevista |
| --- | --- | --- |
| FR-001, FR-002, FR-005 | `products.json`, `catalogApi`, `useCatalog`, `ProductCatalog` | carga local, filtros/orden y estados recuperables |
| FR-003, FR-004 | modelo de entrada local y vistas de catalogo | oferta separada de informacion, atribucion cuando aplique y bloqueo de incompletos |
| FR-006, FR-007, FR-008 | `CartContext`, `cartStore`, `ProductCard`, `CartDrawer` | operaciones CLP, persistencia, compatibilidad y estados condicionales |
| FR-009, FR-014 | estado ficticio y `Checkout` | activar/cerrar perfil demo sin credenciales ni informacion personal |
| FR-010, FR-011, FR-012, FR-013 | `Checkout` y resultado transitorio | importe validado, cuatro estados simulados, aviso, no duplicacion ni pedido real |
| FR-015, FR-016 | componentes Bootstrap existentes | teclado, 360/1280 px, reduced-motion y regresion S6/S7 |
| FR-017 | build estatico de Pages y evidencias | URL publica, subruta/JSON/assets y tres grupos de capturas |

### S8 Assessment Coverage

| Criterio/puntos | Aplicacion concreta | Gate de entrega |
| --- | --- | --- |
| useState / 25 | catalogo, carrito via reducer puro, controles y simulacion | transiciones y ausencia de estado duplicado |
| useEffect / 20 | fetch de JSON local, cancelacion y persistencia | carga dinamica y cleanup bajo StrictMode |
| Renderizado condicional / 20 | loading/error/empty, perfil ficticio, carrito y resultado | pruebas/capturas reproducibles de cada estado |
| Organizacion / 15 | componentes, servicios y utilidades existentes | reutilizacion, nombres y comentarios utiles segun S8 |
| Publicacion / 20 | build `dist` estatico con base path del proyecto | URL publica, repositorio, assets y rutas comprobados |

Conservar busqueda, categorias, destacados, CLP, carrito persistente y validacion de compra
de S6/S7. Configurar un unico workflow GitHub Actions para instalar, correr calidad, generar
`dist` y publicarlo en Pages. No crear build Vercel, variables de modo integrado ni secretos.
La publicacion efectiva y los cambios de settings requieren la autorizacion correspondiente;
este plan no ejecuta ningun despliegue.

## Testing Strategy

**appType**: SPA estatica. **primaryValidationStack**: Vitest/Testing Library y Playwright
Chromium. `npm test`, `npm run test:e2e`, `npm run lint`, `npm run build` y `npm run preview`
ya estan definidos. No hay archivos de pruebas unitarias/E2E todavia. El script
`test:integration` apunta a un archivo inexistente y debe retirarse junto con la configuracion
de tests de backend heredada; no reemplazarlo por una suite de proveedor.

Recorridos criticos: carga/error y filtros del catalogo local; persistencia/migracion y
operaciones del carrito; activar/cerrar perfil ficticio; resultados aprobados/rechazados/
cancelados/pendientes rotulados como simulacion; repeticion, accesibilidad y base path Pages.
Tests deben probar importes CLP enteros, carrito vacio, estado no persistido del recibo,
ausencia de campos personales/pago y no enviar solicitudes a APIs de proveedor.

**Acceptance/review**: comprobar SC-001 a SC-008, 360/1280 px, teclado, foco y reduced-motion;
`npm run lint`, tests unitarios, E2E y build deben pasar. Abrir el `dist` con preview bajo el
base path del proyecto y confirmar JSON/assets, ausencia de errores de consola y avisos
visibles de simulacion. Las capturas acreditan solo el comportamiento educativo; no afirmaran
login, pedidos, inventario ni pagos reales.

**External dependency strategy**: no hay integraciones de datos, identidad o pagos. El catalogo
JSON es una dependencia estatica del build; las URLs de portadas ya presentes pueden fallar y
deben usar alternativa visual. Los tests interceptan o fijan esas imagenes cuando necesiten
determinismo, sin simular un servicio de negocio.

## Execution Prerequisites

- Node 22.12+ y npm compatibles con Vite; Chromium Playwright para E2E.
- Configuracion de Pages para este repositorio y permiso de publicacion, antes del despliegue.
- Ninguna cuenta de proveedor, clave API, SMTP, Docker, Deno, base de datos o secreto.

Los tests/lint/build iniciales constan en [s8-validation.md](../../docs/s8-validation.md);
esta planificacion no los vuelve a ejecutar ni declara implementacion completa. El checklist
de calidad de la spec mantiene CHK001 y CHK016 pendientes por la plataforma Pages nombrada;
no son fallos constitucionales, y el destino publico fue una decision explicita del usuario.
