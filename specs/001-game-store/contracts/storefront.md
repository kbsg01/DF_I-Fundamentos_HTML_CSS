# Storefront Contract

**Date**: 2026-10-02. Consumidores: comprador, evaluador y pruebas de navegador.
**Related**: [spec](../spec.md), [data model](../data-model.md), [backend](backend.md).

## Build modes and navigation

- `academic`: Pages; base `/DF_I-Fundamentos_HTML_CSS/`; fetch de JSON local, carrito,
  buscador, categorias, destacados y estados condicionales. Sin Supabase/RAWG keys ni formularios
  de contrasena, tarjeta o pago. Control de acceso/compra enlaza al hosting integrado aprobado.
  Puede mostrar resumen academico, pero no emitir un pedido aprobado ficticio como real.
- `integrated`: Vercel; base `/`; RAWG via backend, ofertas propias y acceso/pago sandbox.
- La eleccion es build-time explicita; no detectar modo por GITHUB_ACTIONS ni query del visitante.
- Vistas cambian dentro de la SPA existente. Callbacks `/?auth=callback`, `/?auth=recovery`
  y retorno `/?payment=return&orderId=...` usan raiz servida; no requieren rutas profundas.
- URL integrada configurada HTTPS por allowlist. Si no esta configurada, enlace deshabilitado
  con estado no disponible, sin inventar dominio ni solicitar secretos en Pages.

## Catalog interaction

Buscar por titulo con debounce 300 ms; filtros genero/plataforma y orden nombre/lanzamiento
se aplican sobre RAWG completo en integrado, no sobre una pagina aislada. Cada cambio reinicia
pagina y cancela solicitud anterior. Ofertas locales tienen sus categorias actuales conservadas.
Separar ofertas de Q Brands y descubrimiento; no aparentar filtro global de precios RAWG.
Lista normaliza IDs y conserva paginacion. Detalle muestra texto seguro, plataformas, genero,
valoracion disponible y condiciones de oferta. Enlace activo RAWG en cada vista que lo utiliza.
Loading, retry, error, empty y respaldo local son estados distinguibles y accesibles.
Imagen ausente usa alternativa, no colapsa dimensiones de tarjeta.

## Cart interaction

Controles accesibles para sumar/restar/eliminar/vaciar, contador de unidades y total CLP.
Boton de agregar cambia perceptiblemente a estado seleccionado sin impedir incrementar.
Carrito vacio impide checkout. Ofertas incompletas/gratuitas/no disponibles no son agregables.
Cantidad invalidada o datos migrados descartados muestran motivo accionable.
Mutaciones pasan por API unica del contexto; reducer puro usado por setter funcional useState.
Persistencia conserva array legacy mediante migracion al envelope versionado.
Abrir carrito no depende de que RAWG termine o responda correctamente.

## Identity

Integrado ofrece login correo/contrasena, registro, confirmacion requerida y recuperacion.
SDK Supabase, PKCE y URLs registradas; procesar callback antes de volver al checkout.
Errores no autentican al usuario ni revelan si un correo desconocido tiene cuenta.
Mostrar sesion inicializando evita flashes de datos de otro usuario.
Logout/cambio de usuario elimina quote/pedido y caches privadas; carrito de visitante se conserva.
Session expiry solicita nuevo acceso sin perder seleccion, pero invalida quote si corresponde.
No sustituir identidad real por flag local o fixtures en el build publicado integrado.

## Checkout and return

Formulario nativo valido -> acceso verificado -> quote servidor -> revision de lineas,
region/plataforma, cantidades, CLP, subtotal, cargos cero y total -> aceptacion -> preferencia.
Mostrar etiqueta de pruebas antes de pagar y en resultado; nunca solicitar tarjeta en la SPA.
Deshabilitar envio mientras esta en curso; reutilizar Idempotency-Key para la misma confirmacion.
Precio cambiado/version vencida requiere nueva revision explicita, no autoaceptar importe.
Pagina del proveedor se abre en misma pestaña, solo HTTPS/host permitido por integracion.

Retorno lee pedido por JWT y consulta estado persistido; cualquier query `status=approved`
es ignorada. Pending ofrece actualizacion con polling acotado (cada 3 s, maximo 60 s) y refresco
manual; despues del limite sigue pendiente, no rechazado. Servidor reconcilia por separado.
Approved muestra ID y snapshot y resta solo unidades compradas una vez. Rejected/cancelled/
pending/review_required conservan carrito y ofrecen accion acorde, sin generar otro pago pendiente.
Reintento tras fallo terminal usa nuevo quote aceptado, nunca recicla una confirmacion incierta.

## Accessibility and evidence

Bootstrap y lenguaje visual existentes; sin redisenar toda la tienda como landing page.
Nombres accesibles, teclado, foco visible, restauracion de foco al cerrar drawer/modal,
mensajes anunciados y movimiento reducido. Contenido utilizable a 360/1280 px sin solapamientos.
Capturas de catalogo dinamico, agregar/eliminar y empty/loading/sesion/resultado, sin PII.
Evaluacion academica repite operaciones en Pages; E2E integrado usa Vercel y servicios reales.
