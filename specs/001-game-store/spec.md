# Feature Specification: Q Brands - Tienda de juegos con acceso y compra

**Feature Branch**: No creada; el directorio de especificacion es independiente de la rama.

**Created**: 2026-10-02

**Status**: Ready for planning

**Input**: User description: "Necesito generar una tienda educativa de juegos tipo G2A o Eneba,
con catalogo local, acceso y compra simulados, sin integraciones externas. Considerar los
documentos de S8 y los conocimientos previos reflejados en el historial git del repositorio."

## Clarifications

### Session 2026-10-03

- Q: ¿Qué recorrido de acceso y compra debe ofrecer la demo sin conectarse a servicios externos? → A: Simular acceso y resultados de compra localmente, con avisos visibles de que son demostraciones; sin integraciones externas, identidades autenticadas, pedidos ni pagos reales. Todo el catalogo y las ofertas seran datos locales de demostracion.
- Q: ¿La entrega debe seguir publicándose como demo estática pública, aunque no use integraciones externas? → A: Mantener una demo estática pública en GitHub Pages; sin servicios externos durante el uso de la tienda.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Descubrir juegos y comparar ofertas (Priority: P1)

Como visitante quiero explorar el catalogo local de demostracion, buscar por titulo,
filtrar por genero y plataforma, y consultar ofertas ficticias para elegir un producto compatible.

**Why this priority**: El descubrimiento y la informacion comercial fiable son la base de la tienda.

**Independent Test**: Sin iniciar sesion ni comprar, buscar un titulo conocido, filtrar los
resultados y abrir su ficha; comprobar los datos del juego y la disponibilidad de una oferta.

**Acceptance Scenarios**:

1. **Given** el catalogo local de demostracion, **When** abro la tienda, **Then** veo juegos
  con titulo, imagen o alternativa, genero y plataforma; no se consulta ninguna API externa.
2. **Given** juegos de varios generos y plataformas, **When** combino busqueda y filtros,
   **Then** veo solo resultados coincidentes y puedo restablecer los filtros.
3. **Given** un juego con oferta, **When** abro su ficha, **Then** veo descripcion,
   precio vigente, moneda, plataforma de activacion y region antes de agregarlo al carrito.
4. **Given** un juego sin oferta ficticia de Q Brands, **When** lo consulto, **Then** puedo leer
  su informacion, pero no comprarlo ni confundir contenido informativo con una oferta propia.
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

Como visitante quiero demostrar el recorrido de acceso con un perfil ficticio, sin crear una cuenta real.

**Why this priority**: Permite evaluar estados de interfaz sin autenticar personas ni integrar servicios.

**Independent Test**: Activar y cerrar el acceso de demostracion y comprobar que la interfaz
indica que el perfil es ficticio y no expone datos personales.

**Acceptance Scenarios**:

1. **Given** el acceso de demostracion, **When** lo activo, **Then** veo un perfil ficticio
  claramente identificado y regreso al flujo solicitado conservando el carrito.
2. **Given** el acceso de demostracion activo, **When** lo cierro, **Then** la interfaz
  vuelve al estado de visitante y deja de mostrar el perfil ficticio.
3. **Given** cualquier estado de acceso, **When** uso la demo, **Then** no se solicitan
  contrasenas, no se registran cuentas y no se afirma que exista autenticacion real.

---

### User Story 4 - Revisar y simular una compra (Priority: P2)

Como visitante quiero revisar un resumen y simular resultados de compra para entender el flujo,
sin generar pedidos ni pagos reales.

**Why this priority**: Demuestra validaciones y estados de compra sin transacciones externas.

**Independent Test**: Con un carrito preparado, recorrer los resultados ficticios aprobado,
rechazado, cancelado y pendiente; comprobar los avisos, el importe y el estado del carrito.

**Acceptance Scenarios**:

1. **Given** un carrito valido, **When** avanzo a revisar la compra, **Then** veo el resumen,
  cantidades, moneda e importe y un aviso visible de que el flujo es una demostracion.
2. **Given** una linea invalida o un importe inconsistente, **When** intento continuar,
  **Then** la demo bloquea la confirmacion y explica como corregir el carrito.
3. **Given** un resultado simulado aprobado, **When** termina la demostracion, **Then** veo
  un comprobante ficticio y el resumen; la interfaz aclara que no existe pedido ni pago real.
4. **Given** un resultado simulado rechazado, cancelado o pendiente, **When** regreso,
  **Then** veo ese estado como ficticio, conservo el carrito y no se anuncia una compra real.
5. **Given** una confirmacion simulada, **When** repito la accion o recargo el resultado,
  **Then** la interfaz evita duplicar el comprobante de demostracion y no crea transacciones.
6. **Given** el flujo de compra, **When** lo uso, **Then** no se conecta a una pasarela,
  no solicita datos de pago ni entrega claves reales.

---

### User Story 5 - Evaluar la entrega de S8 (Priority: P3)

Como evaluador quiero acceder a la demo estatica publicada y a evidencias del catalogo,
del carrito y de las vistas que cambian con el estado para verificar la entrega.

**Why this priority**: La entrega debe demostrar continuidad y satisfacer la evaluacion academica.

**Independent Test**: Abrir los enlaces publicos del proyecto y la entrega, consultar las
evidencias y repetir los casos de catalogo, carrito vacio y carrito con productos.

**Acceptance Scenarios**:

1. **Given** la entrega publicada en GitHub Pages, **When** abro sus enlaces, **Then** puedo
  acceder a la demo estatica y al repositorio sin permisos privados ni enlaces rotos, sin que
  la tienda se conecte a servicios externos durante su uso.
2. **Given** las evidencias de entrega, **When** las reviso, **Then** encuentro capturas
   de datos cargados dinamicamente, productos agregados/eliminados y estados condicionales.

### Edge Cases

- Imagen, genero, descripcion o puntuacion ausente: usar alternativa explicita sin inventar datos.
- Fallo al cargar los datos locales de demostracion: mostrar un error recuperable sin
  consultar un servicio externo ni presentar datos como si estuvieran actualizados en linea.
- Busquedas sucesivas: los resultados visibles deben corresponder a la ultima consulta solicitada.
- Cambio de filtro entre paginas: reiniciar la navegacion y evitar resultados duplicados.
- Juego homonimo o distintas ediciones: vincular ofertas por identidad estable, no solo por nombre.
- Cantidad cero, negativa, fraccionaria o superior a disponibilidad: impedir una linea invalida.
- Carrito antiguo o datos guardados invalidos: conservar lineas validas y explicar las descartadas.
- Cambio entre visitante y perfil ficticio: no mostrar informacion personal ni asociar datos reales.
- Resultado simulado pendiente o recarga de la confirmacion: identificarlo como ficticio,
  conservar el carrito y evitar comprobantes duplicados.
- Acceso desde movil o solo teclado: mantener disponibles busqueda, filtros, acceso de demostracion,
  carrito y simulacion de compra.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: La tienda DEBE ofrecer exploracion y fichas de juegos desde un catalogo local de demostracion,
  con titulo, imagen alternativa, generos, plataformas, descripcion y valoracion cuando existan.
- **FR-002**: Los visitantes DEBEN buscar por titulo, filtrar por genero y plataforma,
  ordenar por nombre o lanzamiento y recorrer mas resultados sin duplicar juegos.
- **FR-003**: La tienda DEBE distinguir informacion del juego de ofertas propias: precio,
  moneda, descuento si existe, edicion, plataforma de activacion, region y disponibilidad.
  Solo una oferta con esos datos completos puede agregarse al carrito.
- **FR-004**: La tienda NO DEBE consultar APIs externas ni requerir claves o cuentas de proveedores.
  Si los datos locales incluyen contenido de terceros, la entrega DEBE mostrar la atribucion aplicable.
- **FR-005**: La tienda DEBE mostrar estados de carga, error, sin resultados y recuperacion,
  sin bloquear la consulta del carrito existente por un fallo del catalogo.
- **FR-006**: El comprador DEBE agregar, incrementar, disminuir, eliminar y vaciar productos;
  cantidades enteras positivas, contador de unidades, subtotales y total DEBEN permanecer coherentes.
- **FR-007**: El carrito DEBE persistir al recargar y conservarse al acceder en el mismo navegador;
  las selecciones previas validas DEBEN seguir siendo utilizables sin duplicaciones.
- **FR-008**: Las vistas DEBEN reflejar carrito vacio, producto seleccionado, carga y sesion activa,
  incluyendo un cambio perceptible del control de agregar cuando el producto esta en el carrito.
- **FR-009**: La tienda DEBE ofrecer estados locales de acceso y cierre de una identidad ficticia,
  claramente rotulada como demostracion. NO DEBE autenticar usuarios ni ofrecer registro o recuperacion reales.
- **FR-010**: Antes de simular una compra, la tienda DEBE mostrar los productos, cantidades,
  moneda e importe final; no debe requerir una identidad real.
- **FR-011**: La tienda DEBE simular resultados aprobado, rechazado, cancelado y pendiente,
  identificarlos visiblemente como ficticios y aclarar que no existe cobro ni compra real.
- **FR-012**: Antes de la simulacion se DEBEN validar las lineas y el importe local; cualquier
  inconsistencia DEBE bloquear la confirmacion y explicarse. Repetir la accion NO DEBE duplicar
  el comprobante ficticio.
- **FR-013**: El comprobante de demostracion DEBE mostrar un identificador ficticio, lineas,
  cantidades, precios, moneda, total y resultado simulado; NO DEBE crear ni persistir un pedido real.
- **FR-014**: La tienda NO DEBE solicitar ni almacenar contrasenas o datos de tarjetas,
  ni presentar el perfil ficticio o el comprobante como datos de una cuenta o compra reales.
- **FR-015**: Los recorridos principales DEBEN funcionar en movil y escritorio, con teclado,
  nombres accesibles, foco visible y respeto a la preferencia de movimiento reducido.
- **FR-016**: La entrega DEBE conservar la busqueda, categorias, ofertas destacadas, carrito
  persistente y validacion de compra adquiridas en semanas previas, salvo cambio justificado.
- **FR-017**: La entrega DEBE incluir tienda y repositorio publicos, enlaces verificables y
  capturas del catalogo dinamico, operaciones del carrito y vistas condicionales.

### Key Entities *(include if feature involves data)*

- **Juego**: Identidad estable dentro del catalogo local, titulo, descripcion, imagenes, generos, plataformas,
  lanzamiento y valoraciones; su existencia no implica que Q Brands tenga una oferta.
- **Oferta**: Identidad propia, juego asociado, edicion, plataforma y region de activacion,
  precio normal/vigente, moneda y disponibilidad; Q Brands es el unico vendedor de esta version.
- **Perfil ficticio y estado de acceso**: Nombre de demostracion y estado local, sin identidad autenticada.
- **Carrito y linea**: Seleccion del comprador o visitante, oferta, cantidad y subtotal;
  contador de unidades y total derivan de las lineas.
- **Comprobante de demostracion**: Identificador ficticio, copia temporal del resumen, importes
  y resultado simulado; no representa un pedido persistido.
- **Resultado simulado**: Estado aprobado, rechazado, cancelado o pendiente seleccionado
  para demostrar la interfaz; no representa una transaccion de pago.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: En 10 recorridos con fuentes disponibles, al menos 9 permiten encontrar
  un juego conocido y consultar su ficha en menos de 60 segundos.
- **SC-002**: El 100% de los casos de agregar, cambiar cantidad, eliminar, vaciar y recargar
  conserva un contador y total exactos; ningun juego sin oferta permite comprar.
- **SC-003**: El 100% de los casos de acceso y cierre simulados muestra el estado correcto,
  identifica el perfil como ficticio y no solicita credenciales ni expone datos personales.
- **SC-004**: Una persona con carrito preparado completa acceso de demostracion, revision
  y resultado simulado en menos de 3 minutos.
- **SC-005**: El 100% de los casos aprobado, rechazado, cancelado, pendiente y repetido
  muestra un resultado ficticio sin crear pedidos ni pagos reales, solicitar datos de pago
  ni entregar claves reales.
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
- El catalogo y las ofertas usan datos locales de demostracion. No se integra RAWG ni otro
  servicio externo; la atribucion se conserva cuando corresponda a la procedencia de los datos.
- El acceso y la compra son simulaciones educativas. No hay autenticacion, pedidos, pagos,
  inventario ni entrega de claves reales, ni se solicitan secretos o datos de pago.
- La entrega puede demostrar los recorridos de forma local y no depende de cuentas, credenciales
  ni disponibilidad de servicios externos.
- La demo se publica como sitio estatico publico en GitHub Pages para la evaluacion S8; el hosting
  no implica integrar APIs, identidad, pagos ni otros servicios externos durante el uso.
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
La planificacion debe demostrar cobertura de los cinco criterios academicos: gestion del estado
del catalogo/carrito/interacciones (25 puntos), carga dinamica (20), vistas condicionales (20),
organizacion y explicacion del codigo (15) y publicacion verificable (20). Las herramientas y
tecnicas concretas exigidas por esas fuentes se documentaran en el plan, no como resultados de usuario.