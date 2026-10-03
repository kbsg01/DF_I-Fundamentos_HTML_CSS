# Validacion de implementacion S8

## Baseline previo

Fecha: 2026-10-03. Rama: `s8`.

| Comprobacion | Resultado |
| --- | --- |
| `npm run lint` | PASS; exit code 0, sin diagnosticos |
| `npm run build` | PASS; Vite 8.3.1 genero `dist/` |
| Node.js / npm | Node 26.8.1 / npm 11.19.0 |
| Docker CLI / daemon | CLI disponible; daemon no disponible (pipe Docker Desktop ausente) |
| Deno | No instalado |
| Playwright CLI / Chromium | CLI no instalado; browser no comprobado |
| Supabase CLI | No instalado |
| Suites previas | No hay scripts `test`, integration o e2e ni archivos de pruebas |

No se modifico el codigo durante la medicion del baseline. Las pruebas que requieren Docker,
Deno, Chromium o servicios externos quedan bloqueadas hasta configurar cada requisito.

## Seguimiento

Registrar por tarea: comando, resultado, conteos pass/fail/skip, entorno y evidencia sin PII
ni secretos. No marcar fixtures como integraciones reales. Las verificaciones posteriores se
agregaran en las fases correspondientes.

## Implementacion local: Setup, Foundation y US1

Fecha: 2026-10-03. Sin servicios externos, credenciales ni despliegues.

| Comprobacion | Resultado |
| --- | --- |
| `npm test -- --run tests/unit/demoProducts.test.js tests/unit/catalogApi.test.js` | PASS: 13 tests |
| `npm run test:e2e` | PASS: 8 tests entre Chromium desktop (1280 px) y mobile (360 px) |
| `npm run lint` | PASS: exit code 0 |
| `npm run build` con `VITE_BASE_PATH=/DF_I-Fundamentos_HTML_CSS/` | PASS: Vite 8.3.1 genero `dist/` con base Pages |

US1 cubre carga del JSON local, busqueda, filtros, orden, paginacion, detalle, oferta no disponible,
error recuperable y reintento. Diez recorridos locales de busqueda/detalle terminaron bajo 60 s.
Los datos comerciales/stock son ficticios y la interfaz informa que la demo no procesa compras.
La suite incluye regresion para no reintentar una solicitud cuando su AbortSignal ya se cancelo
durante el backoff bajo React StrictMode.

No se ha desplegado GitHub Pages; el gate de publicacion y sus permisos siguen pendientes.

## Implementacion local: US2 Carrito

Fecha: 2026-10-03. Sin servicios externos ni datos de comprador.

| Comprobacion | Resultado |
| --- | --- |
| `npm test -- --run tests/unit/cart.test.jsx tests/unit/demoProducts.test.js tests/unit/catalogApi.test.js` | PASS: 18 tests |
| `npm run test:e2e -- tests/e2e/cart.spec.js` | PASS: 8 tests entre Chromium desktop (1280 px) y mobile (360 px) |
| `npx eslint src/context/CartContext.jsx src/components/CartDrawer.jsx tests/unit/cart.test.jsx tests/e2e/cart.spec.js` | PASS: exit code 0 |

El carrito mantiene el formato legacy `qBrandsCart`, aritmetica CLP entera, limite local de oferta,
fallo de storage sin perder el estado en memoria, controles accesibles y retorno del foco al disparador.
El drawer cierra con Escape y usa semantica de dialogo modal. No se creo pedido ni se solicito pago.

El build completo se repetira en el gate final tras integrar acceso y checkout simulados.

## Implementacion local: US3 Acceso ficticio

Fecha: 2026-10-03. Sin autenticacion, email ni datos personales.

| Comprobacion | Resultado |
| --- | --- |
| `npm test -- --run` | PASS: 19 tests |
| `npm run test:e2e` | PASS: 18 tests entre Chromium desktop (1280 px) y mobile (360 px) |
| `npm run lint` | PASS: exit code 0 |
| `npm run build` con `VITE_BASE_PATH=/DF_I-Fundamentos_HTML_CSS/` | PASS: Vite 8.3.1 genero `dist/` |

US3 solo activa/cierra el perfil fijo `Visitante de demostracion` en estado React. El E2E
confirmo que no hay campos de email/contrasena, el perfil vuelve a visitante tras reload y
el carrito local conserva su linea. No existe sesion, identidad ni persistencia de perfil.

## Implementacion local: US4 Checkout simulado

Fecha: 2026-10-03. Sin datos personales, pagos, pedidos ni servicios.

| Comprobacion | Resultado |
| --- | --- |
| `npm test -- --run` | PASS: 25 tests |
| `npm run test:e2e` | PASS: 22 tests entre Chromium desktop (1280 px) y mobile (360 px) |
| `npm run test:e2e -- --project=chromium-desktop tests/e2e/checkout.spec.js` | PASS: 2 tests, incluidos campos personales/de pago ausentes |
| `npm run lint` | PASS: exit code 0 |
| `npm run build` con `VITE_BASE_PATH=/DF_I-Fundamentos_HTML_CSS/` | PASS: Vite 8.3.1 genero `dist/` |

El servicio `demoCheckout` valida ofertas completas, calcula CLP enteros y crea un recibo efimero
con uno de cuatro estados ficticios. El E2E verifico que la aprobacion simulada retira el snapshot,
los otros resultados conservan el carrito y la pantalla no solicita datos personales o de pago.
No se ha publicado el sitio; el gate de Pages permanece pendiente de autorizacion explicita.

## US5 Preparacion estatica

- T033 pasa en Chromium desktop: catalogo JSON 200, enlace del repositorio correcto y cero requests de negocio externos.
- Workflow `workflow_dispatch` configurado con quality antes del job de Pages y build bajo `/DF_I-Fundamentos_HTML_CSS/`.
- Capturas locales listas: `docs/s8/catalog.png`, `docs/s8/cart.png` y `docs/s8/conditional.png`.
- Repositorio: https://github.com/kbsg01/DF_I-Fundamentos_HTML_CSS.
- No se despacho el workflow. La URL Pages y smoke publico quedan pendientes de autorizacion/despliegue.

## Gate final local: T041

Fecha: 2026-10-03. Ejecucion sin proveedores, secretos ni despliegue.

| Comprobacion | Resultado |
| --- | --- |
| `npm test -- --run` | PASS: 25 tests |
| `npm run test:e2e` | PASS: 26 tests entre Chromium desktop (1280 px) y mobile (360 px) |
| `npm run lint` | PASS: exit code 0 |
| `VITE_BASE_PATH=/DF_I-Fundamentos_HTML_CSS/ npm run build` | PASS: Vite 8.3.1 genero `dist/` |
| Smoke de `dist` montado bajo `/DF_I-Fundamentos_HTML_CSS/` | PASS: HTML, JS, CSS, JSON y placeholder devuelven HTTP 200; busqueda y detalle funcionan |

El smoke local uso `python -m http.server` sobre una copia temporal ignorada en `test-results/`.
`vite preview` sirve `dist` desde `/` y no simula por si solo el prefijo de un project site.
T037/T038 siguen pendientes: no se despacho GitHub Actions ni se afirma una URL Pages.

## Correccion CI: overflow mobile

GitHub Actions reporto `scrollWidth=366` en viewport de 360 px; la anotacion identifico el
enlace `Soporte` en `right=366`. El footer tenia cuatro enlaces pero la media query tardia
de mobile mantenia tres columnas `max-content` y sobrescribia la primera correccion. Ambas
reglas mobile usan ahora dos columnas flexibles con `min-width: 0`. Validacion en `s8`:
`npm run test:e2e` -> 26/26 PASS; `npm run lint` -> PASS. Se agrego diagnostico de elementos
desbordados a `tests/e2e/accessibility.spec.js` para que una regresion identifique el elemento.

