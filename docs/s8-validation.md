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

Al cierre de esta fase local, aun no se habia desplegado GitHub Pages.

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
Al cierre de US4, el despliegue aun estaba pendiente de autorizacion explicita.

## US5 Preparacion estatica

- T033 pasa en Chromium desktop: catalogo JSON 200, enlace del repositorio correcto y cero requests de negocio externos.
- Workflow con gate de calidad antes del deploy; `peaceiris/actions-gh-pages` publica `dist` en `gh-pages` bajo `/DF_I-Fundamentos_HTML_CSS/`.
- Capturas locales listas: `docs/s8/catalog.png`, `docs/s8/cart.png` y `docs/s8/conditional.png`.
- Repositorio: [Q Brands en GitHub](https://github.com/kbsg01/DF_I-Fundamentos_HTML_CSS).
- Al preparar esta fase, aun no se habia despachado el workflow ni completado el smoke publico.

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
Al registrar T041, T037/T038 seguian pendientes; el despliegue y la auditoria se completaron despues.

## Correccion CI: overflow mobile

GitHub Actions reporto `scrollWidth=366` en viewport de 360 px; la anotacion identifico el
enlace `Soporte` en `right=366`. El footer tenia cuatro enlaces pero la media query tardia
de mobile mantenia tres columnas `max-content` y sobrescribia la primera correccion. Ambas
reglas mobile usan ahora dos columnas flexibles con `min-width: 0`. Validacion en `s8`:
`npm run test:e2e` -> 26/26 PASS; `npm run lint` -> PASS. Se agrego diagnostico de elementos
desbordados a `tests/e2e/accessibility.spec.js` para que una regresion identifique el elemento.

## Publicacion y auditoria final

Fecha: 2026-10-03. Publicacion autorizada; sin servicios externos, credenciales de proveedores ni datos reales.

| Comprobacion | Resultado |
| --- | --- |
| GitHub Actions run [37161050545](https://github.com/kbsg01/DF_I-Fundamentos_HTML_CSS/actions/runs/37161050545), commit `59f38b6` | PASS: `quality` y `deploy` completados |
| Rama `gh-pages` | PASS: actualizada al commit `7b9e5ed`; Pages configurado desde `gh-pages` `/` |
| Demo publica | PASS: HTTP 200, titulo `q-brands`, encabezado visible y 21 videojuegos cargados |
| Base path y recursos | PASS: JavaScript, CSS, `data/products.json` y placeholder HTTP 200 bajo `/DF_I-Fundamentos_HTML_CSS/`; 13/13 imagenes visibles cargadas |
| Enlace al repositorio | PASS: destino `https://github.com/kbsg01/DF_I-Fundamentos_HTML_CSS` |
| Calidad de CI | PASS: jobs `quality` y `deploy` exitosos; quality incluye pruebas unitarias, E2E, lint y build |

El smoke publico comprobo carga y recursos, no repitio todos los flujos interactivos en produccion.
Los flujos funcionales se cubrieron en el gate local (25 pruebas unitarias y 26 E2E en Chromium desktop/mobile).

### Criterios de la pauta S8

| Criterio | Evidencia revisada | Estado |
| --- | --- | --- |
| 1. Estado con `useState` para catalogo, carrito e interacciones | `src/App.jsx`, `src/hooks/useCatalog.js`, `src/context/CartContext.jsx`; pruebas unitarias y E2E | Verificado |
| 2. `useEffect` para carga dinamica | `src/hooks/useCatalog.js`; solicitud publica a `data/products.json` devuelve 200 | Verificado |
| 3. Renderizado condicional | Estados de catalogo, acceso, carrito y checkout; tres capturas y pruebas E2E | Verificado |
| 4. Organizacion del proyecto | Componentes, hooks, servicios y contexto; `npm run lint` y `npm run build` pasan | Verificado |
| 5. Publicacion React en GitHub Pages | URL publica HTTP 200; run y rama `gh-pages` confirmados | Verificado |

### Cobertura y gaps

- FR-001 a FR-005 / SC-001 y SC-007: catalogo JSON, busqueda, filtros, orden, detalle, estados y recuperacion; 10 recorridos locales bajo 60 s y pruebas T014/T033.
- FR-006 a FR-008 / SC-002: mutaciones, persistencia y totales del carrito; pruebas T021.
- FR-009 y FR-014 / SC-003: perfil ficticio, cierre y ausencia de credenciales/datos personales; pruebas T026.
- FR-010 a FR-013 / SC-004 y SC-005: checkout y resultados ficticios, validacion y recibo efimero; pruebas T032. **Gap:** no se registro una medicion de duracion que demuestre el umbral de menos de 3 minutos de SC-004.
- FR-015 / SC-006: teclado, foco, reduced motion y viewports 360/1280; T039/T041 y CI E2E 26/26. La regresion de overflow fue corregida y vuelta a probar.
- FR-016: busqueda, categorias, ofertas destacadas y carrito; suites de catalogo/carrito y capturas.
- FR-017 / SC-008: demo y repositorio publicos, tres evidencias locales y los cinco criterios de S8 documentados arriba.
- `package.json` y `src/` no muestran SDKs ni solicitudes de autenticacion/pago/catalogo de terceros; la unica llamada de negocio es al JSON local. Las imagenes de portada pueden cargar desde CDN segun README.
- La constitucion revisada se respeta en estado React, catalogo independiente, accesibilidad, carrito y validacion local; lint/build pasaron antes de publicar.
- La checklist de requisitos conserva CHK001 y CHK016 sin marcar. SC-004 queda como gap de medicion; no se declara ese umbral cumplido sin evidencia.

La publicacion sirve solo el build estatico; no activa autenticacion, pagos ni integraciones reales.

