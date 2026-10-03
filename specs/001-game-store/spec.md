# Feature Specification: Q Brands - Tienda de juegos con acceso y compra

**Feature Branch**: No creada; el directorio de especificacion es independiente de la rama.

**Created**: 2026-10-02

**Status**: Ready for planning

**Input**: User description: "Necesito generar una tienda de juegos tipo G2A o Eneba,
con login integrado, carrito de pagos e integracion con RAWG. Considerar los documentos
de S8 y los conocimientos previos reflejados en el historial git del repositorio."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Descubrir juegos y comparar ofertas (Priority: P1)

Como visitante quiero explorar juegos, buscar por titulo, filtrar por genero y plataforma,
y consultar los detalles de una oferta para elegir un producto compatible conmigo.

**Why this priority**: El descubrimiento y la informacion comercial fiable son la base de la tienda.

**Independent Test**: Sin iniciar sesion ni comprar, buscar un titulo conocido, filtrar los
resultados y abrir su ficha; comprobar los datos del juego y la disponibilidad de una oferta.

**Acceptance Scenarios**:

1. **Given** una fuente de juegos disponible, **When** abro la tienda, **Then** veo juegos
   con titulo, imagen o alternativa, genero y plataforma, y un enlace de atribucion a RAWG.
2. **Given** juegos de varios generos y plataformas, **When** combino busqueda y filtros,
   **Then** veo solo resultados coincidentes y puedo restablecer los filtros.
3. **Given** un juego con oferta, **When** abro su ficha, **Then** veo descripcion,
   precio vigente, moneda, plataforma de activacion y region antes de agregarlo al carrito.
4. **Given** un juego sin oferta de Q Brands, **When** lo consulto, **Then** puedo leer
   su informacion, pero no comprarlo ni confundir un enlace externo con una oferta propia.
5. **Given** una carga fallida o sin resultados, **When** consulto el catalogo,
   **Then** veo un estado identificable y una accion para reintentar o ajustar la busqueda.

---

### User Story 2 - Preparar y conservar el carrito (Priority: P1)

Como comprador quiero agregar ofertas, modificar cantidades y revisar el total antes de pagar,
sin perder mi seleccion al recargar la pagina o iniciar sesion.

**Why this priority**: Permite seleccionar compras y preserva la funcionalidad de semanas anteriores.

**Independent Test**: Con ofertas de prueba, agregar dos productos, aumentar y reducir cantidades,
eliminar un producto y recargar; verificar que el contador, las lineas y el total coinciden.

**Acceptance Scenarios**:

1. **Given** una oferta disponible, **When** la agrego, **Then** se actualizan la linea,
   el contador de unidades, el total y el estado visible de la accion de agregar.
2. **Given** un carrito con productos, **When** modifico cantidades o elimino una linea,
   **Then** subtotales y total reflejan exactamente las cantidades y precios vigentes.
3. **Given** un carrito guardado, **When** recargo o inicio sesion en el mismo navegador,
   **Then** conservo los productos y cantidades sin duplicaciones.
4. **Given** un carrito vacio, **When** lo abro, **Then** veo un mensaje de carrito vacio
   y una accion para explorar juegos; no puedo iniciar un pago.

---

### User Story 3 - Acceder a una cuenta (Priority: P2)

Como comprador quiero iniciar y cerrar sesion, reconocer mi cuenta activa y retomar mi compra.

**Why this priority**: El acceso integrado permite asociar el pedido al comprador.

**Independent Test**: Con una identidad de prueba, iniciar sesion, recargar, cerrar sesion
y comprobar que las vistas reflejan cada estado sin mostrar informacion de otra cuenta.

**Acceptance Scenarios**:

1. **Given** una identidad valida, **When** inicio sesion, **Then** veo mi cuenta activa
   y regreso al flujo desde el que solicite el acceso conservando el carrito.
2. **Given** datos invalidos o un servicio no disponible, **When** intento acceder,
   **Then** veo un error recuperable y no obtengo una sesion autenticada.
3. **Given** una sesion activa, **When** cierro sesion, **Then** dejo de ver informacion
   privada y las acciones reservadas a compradores requieren volver a acceder.
4. **Given** un comprador sin cuenta o sin acceso a ella, **When** solicita registrarse
  o recuperar el acceso, **Then** puede completar el recorrido de identidad y acceder con
  una cuenta real; una identidad ficticia no habilita una sesion valida.

---

### User Story 4 - Revisar el pedido y completar el pago (Priority: P2)

Como comprador identificado quiero revisar mi pedido, conocer el importe final y obtener
una confirmacion solo cuando el resultado del pago lo permita.

**Why this priority**: Completa el recorrido comercial sin confundir una solicitud con una compra.

**Independent Test**: Con una cuenta y carrito preparados, recorrer resultados de pago aprobado,
rechazado, cancelado y pendiente; comprobar pedido, importe y conservacion del carrito.

**Acceptance Scenarios**:

1. **Given** un carrito valido, **When** avanzo a pagar, **Then** se solicita acceso si
   falta sesion y se muestran productos, cantidades, moneda y todos los cargos antes de confirmar.
2. **Given** datos incompletos, una oferta retirada o un precio modificado, **When** confirmo,
   **Then** se bloquea el pago y se explica la correccion; los cambios de importe requieren aceptacion.
3. **Given** un pago aprobado, **When** termina el proceso, **Then** veo un identificador
   de pedido, su estado y el resumen comprado; solo se retiran las lineas incluidas en ese pedido.
4. **Given** un pago rechazado, cancelado o pendiente, **When** regreso a la tienda,
   **Then** veo el resultado real, conservo el carrito y no se anuncia una compra aprobada.
5. **Given** una confirmacion ya enviada, **When** repito la accion o recargo el resultado,
   **Then** no se crea otro pedido ni se cobra dos veces por la misma confirmacion.
6. **Given** el entorno de pruebas, **When** inicio el pago, **Then** se informa que
  no hay cobro real, se usan exclusivamente medios de prueba y no se entrega una clave real.

---

### User Story 5 - Evaluar la entrega de S8 (Priority: P3)

Como evaluador quiero acceder a la tienda publicada y a evidencias del catalogo dinamico,
del carrito y de las vistas que cambian con el estado para verificar la entrega.

**Why this priority**: La entrega debe demostrar continuidad y satisfacer la evaluacion academica.

**Independent Test**: Abrir los enlaces publicos del proyecto y la entrega, consultar las
evidencias y repetir los casos de catalogo, carrito vacio y carrito con productos.

**Acceptance Scenarios**:

1. **Given** la entrega publicada, **When** abro sus enlaces, **Then** puedo acceder a la
   tienda y al repositorio sin permisos privados ni enlaces rotos.
2. **Given** las evidencias de entrega, **When** las reviso, **Then** encuentro capturas
   de datos cargados dinamicamente, productos agregados/eliminados y estados condicionales.

### Edge Cases

- Imagen, genero, descripcion o puntuacion ausente: usar alternativa explicita sin inventar datos.
- Limite de consultas, caida de RAWG o acceso no configurado: mostrar fallo y recuperacion;
  cualquier catalogo de respaldo debe identificarse y no aparentar datos externos actualizados.
- Busquedas sucesivas: los resultados visibles deben corresponder a la ultima consulta solicitada.
- Cambio de filtro entre paginas: reiniciar la navegacion y evitar resultados duplicados.
- Juego homonimo o distintas ediciones: vincular ofertas por identidad estable, no solo por nombre.
- Cantidad cero, negativa, fraccionaria o superior a disponibilidad: impedir una linea invalida.
- Carrito antiguo o datos guardados invalidos: conservar lineas validas y explicar las descartadas.
- Sesion expirada o cuenta distinta durante el pago: volver a validar acceso sin exponer otro pedido.
- Cierre de sesion: separar los datos privados; no asociar automaticamente pedidos a otra cuenta.
- Interrupcion o resultado de pago desconocido: mostrar estado pendiente y evitar un nuevo cobro.
- Acceso desde movil o solo teclado: mantener disponibles busqueda, filtros, acceso, carrito y pago.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: La tienda DEBE ofrecer exploracion y fichas de juegos alimentadas por RAWG,
  con titulo, imagen alternativa, generos, plataformas, descripcion y valoracion cuando existan.
- **FR-002**: Los visitantes DEBEN buscar por titulo, filtrar por genero y plataforma,
  ordenar por nombre o lanzamiento y recorrer mas resultados sin duplicar juegos.
- **FR-003**: La tienda DEBE distinguir informacion del juego de ofertas propias: precio,
  moneda, descuento si existe, edicion, plataforma de activacion, region y disponibilidad.
  Solo una oferta con esos datos completos puede agregarse al carrito.
- **FR-004**: Toda vista con datos o imagenes de RAWG DEBE incluir atribucion y enlace activo
  a RAWG; la entrega DEBE respetar las condiciones de uso aplicables.
- **FR-005**: La tienda DEBE mostrar estados de carga, error, sin resultados y recuperacion,
  sin bloquear la consulta del carrito existente por un fallo del catalogo.
- **FR-006**: El comprador DEBE agregar, incrementar, disminuir, eliminar y vaciar productos;
  cantidades enteras positivas, contador de unidades, subtotales y total DEBEN permanecer coherentes.
- **FR-007**: El carrito DEBE persistir al recargar y conservarse al acceder en el mismo navegador;
  las selecciones previas validas DEBEN seguir siendo utilizables sin duplicaciones.
- **FR-008**: Las vistas DEBEN reflejar carrito vacio, producto seleccionado, carga y sesion activa,
  incluyendo un cambio perceptible del control de agregar cuando el producto esta en el carrito.
- **FR-009**: La tienda DEBE integrar inicio y cierre de sesion, restauracion de sesion valida,
  errores recuperables y separacion de informacion entre cuentas. La autenticacion DEBE ser
  real, no una simulacion local; el comprador DEBE poder registrarse y recuperar el acceso
  mediante el recorrido ofrecido por el servicio de identidad.
- **FR-010**: Para confirmar un pedido el comprador DEBE identificarse y completar los datos
  requeridos; el resumen DEBE mostrar el importe final en una moneda antes de autorizar el pago.
- **FR-011**: La tienda DEBE ofrecer el flujo de pago y distinguir aprobado, rechazado,
  cancelado y pendiente sin declarar una compra exitosa prematuramente. El pago DEBE integrarse
  con una pasarela en entorno de pruebas, no ser una simulacion exclusivamente local. DEBE
  identificarse como prueba, no admitir cobros reales ni entregar claves reales.
- **FR-012**: Antes de pagar se DEBEN verificar oferta, disponibilidad e importe; cualquier
  cambio DEBE mostrarse y ser aceptado. Una confirmacion repetida NO DEBE duplicar pedidos ni cobros.
- **FR-013**: El pedido DEBE conservar identidad del comprador, lineas, cantidades, precios,
  moneda, total y estado de pago; la confirmacion DEBE incluir un identificador unico y resumen.
- **FR-014**: La tienda NO DEBE guardar contrasenas en texto legible ni datos completos de tarjetas,
  ni mostrar informacion privada de una cuenta tras cerrar sesion o cambiar de usuario.
- **FR-015**: Los recorridos principales DEBEN funcionar en movil y escritorio, con teclado,
  nombres accesibles, foco visible y respeto a la preferencia de movimiento reducido.
- **FR-016**: La entrega DEBE conservar la busqueda, categorias, ofertas destacadas, carrito
  persistente y validacion de compra adquiridas en semanas previas, salvo cambio justificado.
- **FR-017**: La entrega DEBE incluir tienda y repositorio publicos, enlaces verificables y
  capturas del catalogo dinamico, operaciones del carrito y vistas condicionales.

### Key Entities *(include if feature involves data)*

- **Juego**: Identidad externa estable, titulo, descripcion, imagenes, generos, plataformas,
  lanzamiento y valoraciones; su existencia no implica que Q Brands tenga una oferta.
- **Oferta**: Identidad propia, juego asociado, edicion, plataforma y region de activacion,
  precio normal/vigente, moneda y disponibilidad; Q Brands es el unico vendedor de esta version.
- **Cuenta y sesion**: Identidad del comprador, nombre visible y estado/vigencia de su acceso.
- **Carrito y linea**: Seleccion del comprador o visitante, oferta, cantidad y subtotal;
  contador de unidades y total derivan de las lineas.
- **Pedido**: Identificador, comprador, copia de las ofertas compradas, importes y estado.
- **Intento de pago**: Pedido relacionado, importe, resultado y referencia que permita
  reconocer el mismo intento sin duplicar una compra.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: En 10 recorridos con fuentes disponibles, al menos 9 permiten encontrar
  un juego conocido y consultar su ficha en menos de 60 segundos.
- **SC-002**: El 100% de los casos de agregar, cambiar cantidad, eliminar, vaciar y recargar
  conserva un contador y total exactos; ningun juego sin oferta permite comprar.
- **SC-003**: El 100% de los casos de acceso valido, acceso invalido, expiracion y cierre
  muestra el estado correcto y no revela informacion de otra cuenta; registro y recuperacion
  permiten obtener acceso real y las identidades ficticias no autentican.
- **SC-004**: Un comprador con carrito preparado completa acceso, revision y confirmacion
  en menos de 3 minutos, excluyendo esperas externas de autorizacion.
- **SC-005**: El 100% de los casos aprobado, rechazado, cancelado, pendiente y repetido
  produce el estado esperado sin pedidos ni cobros duplicados, y el 100% de esos recorridos
  esta identificado como prueba, sin transacciones monetarias ni entrega de claves reales.
- **SC-006**: A 360 y 1280 pixeles de ancho, todos los recorridos principales son utilizables
  sin contenido superpuesto ni desplazamiento horizontal; pueden completarse solo con teclado.
- **SC-007**: Ante cada fallo de catalogo ensayado se comunica un estado recuperable,
  y el carrito previamente valido sigue siendo consultable.
- **SC-008**: La entrega permite al evaluador reproducir los 3 grupos de evidencias
  academicas desde enlaces publicos validos y verificar los 5 criterios de la pauta de S8.

## Assumptions

- El alcance es evolucionar Q Brands, no construir otro proyecto. G2A y Eneba son referencias
  de experiencia comercial, no marcas, contenidos ni disenos que se deban copiar.
- Q Brands sera el unico vendedor: no incluye alta de vendedores, comisiones ni liquidaciones
  de marketplace. No incluye inventario ni entrega de claves reales en esta primera version.
- Idioma principal: espanol; moneda inicial: CLP, coherente con el antecedente del proyecto.
- RAWG aporta metadatos y enlaces a otras tiendas, no precios de Q Brands, inventario,
  cuentas de clientes, cobros ni claves de activacion. Las ofertas propias permanecen independientes.
- La fuente local de ofertas se conserva; las nuevas consultas externas enriquecen el catalogo
  sin convertir todos los juegos del proveedor en productos vendibles.
- Se asume navegacion publica y carrito de visitante, con acceso requerido antes de confirmar.
  El usuario confirma autenticacion real; el proveedor y mecanismo se elegiran en el plan.
- El usuario confirma pagos mediante una pasarela en entorno de pruebas. El proveedor se
  elegira en el plan segun soporte de CLP y escenarios de prueba. No se habilitara produccion.
- La entrega depende de acceso autorizado a RAWG y de las condiciones vigentes de su servicio;
  requiere servicios de identidad real y de pago en pruebas. No se solicitan secretos
  ni se ejecutan compras, despliegues o cambios de codigo durante esta especificacion.
- El plan DEBE contrastar la constitucion vigente con las obligaciones academicas y documentar
  cualquier conflicto antes de implementar; esta especificacion no modifica la gobernanza.
- Los documentos de S8 son lineamientos obligatorios del plan, no requisitos para reconstruir
  literalmente su ejemplo didactico de agregar/eliminar juegos del catalogo.
- Antecedentes git: `d8603c1` (S6, interacciones y catalogo), `e8c30c7` (migracion S7),
  `cc292c2` (carrito compartido), `35b079b` (carga y reintentos), `8298051` (CLP),
  `0b1661f` y `5a6eab5` (publicacion y correccion). Son contexto historico, no prueba de
  conformidad de una futura implementacion.

### Referencias obligatorias para el plan

- [Guia S8](../../docs/s8%20docs/PFY2201_Exp3_S8_GA_Aplicando_y_optimizando_funcionalidades_en_React.md).
- [Instrucciones S8](../../docs/s8%20docs/PFY2201_Exp3_S8_Instrucciones_especificas%20%28forma%20A%29.md).
- [Pauta S8](../../docs/s8%20docs/PFY2201_Exp3_S8_Pauta_de_evaluacion_sumativa.md).
- [Constitucion](../../.specify/memory/constitution.md).
- [Documentacion RAWG](https://api.rawg.io/docs/?format=openapi).

La planificacion debe demostrar cobertura de los cinco criterios academicos: gestion del estado
del catalogo/carrito/interacciones (25 puntos), carga dinamica (20), vistas condicionales (20),
organizacion y explicacion del codigo (15) y publicacion verificable (20). Las herramientas y
tecnicas concretas exigidas por esas fuentes se documentaran en el plan, no como resultados de usuario.