/* =====================================================================
   BQBrand - Lógica de la página principal del eCommerce
   Actividad sumativa Semana 6 - Desarrollo Frontend I (PFY2201)
   ===================================================================== */

// Estado global de la aplicación
let productosOriginales = []; // catálogo completo, tal como llega del JSON
let carrito = []; // { id, nombre, precio, cantidad }

// Referencias a elementos del DOM reutilizadas por varias funciones
const contenedorProductos = document.getElementById('contenedor-productos');
const alertaCarga = document.getElementById('alerta-carga');
const listaCarrito = document.getElementById('lista-carrito');
const totalCarrito = document.getElementById('total-carrito');
const contadorCarrito = document.getElementById('contador-carrito');
const formularioBusqueda = document.getElementById('form-busqueda');
const inputBusqueda = document.getElementById('input-busqueda');

/**
 * Carga el catálogo de productos desde el archivo JSON local usando Fetch API.
 * Si la respuesta no es exitosa o la petición falla (por ejemplo, ruta incorrecta
 * o sin conexión), muestra un mensaje de error amigable en vez de romper la página.
 */
function cargarProductos() {
  fetch('assets/js/products.json')
    .then((respuesta) => {
      if (!respuesta.ok) {
        throw new Error(`Respuesta HTTP ${respuesta.status}`);
      }
      return respuesta.json();
    })
    .then((datos) => {
      productosOriginales = datos;
      renderizarProductos(productosOriginales);
    })
    .catch((error) => {
      console.error('Error al cargar el catálogo de productos:', error);
      mostrarError('No pudimos cargar los productos en este momento. Intenta recargar la página más tarde.');
    });
}

/**
 * Dibuja en el DOM la lista de productos recibida, reemplazando el contenido actual.
 * Si la lista viene vacía (por ejemplo, tras una búsqueda sin resultados), muestra un aviso.
 */
function renderizarProductos(listaProductos) {
  contenedorProductos.innerHTML = '';

  if (listaProductos.length === 0) {
    const aviso = document.createElement('p');
    aviso.className = 'col-12 text-center text-muted';
    aviso.textContent = 'No se encontraron productos que coincidan con tu búsqueda.';
    contenedorProductos.appendChild(aviso);
    return;
  }

  listaProductos.forEach((producto) => {
    contenedorProductos.appendChild(crearTarjetaProducto(producto));
  });
}

/**
 * Construye la tarjeta (card) Bootstrap de un producto individual.
 * El botón "Agregar al carrito" guarda el id del producto en data-id
 * para que el listener delegado sepa qué producto agregar.
 */
function crearTarjetaProducto(producto) {
  const columna = document.createElement('div');
  columna.className = 'col';

  columna.innerHTML = `
    <div class="card h-100 shadow-sm card-producto">
      <img src="${producto.imagen}" class="card-img-top" alt="${producto.nombre}">
      <div class="card-body d-flex flex-column">
        <h3 class="card-title h6">${producto.nombre}</h3>
        <p class="card-text text-muted small flex-grow-1">${producto.descripcion}</p>
        <p class="fw-bold mb-2">${formatearPrecio(producto.precio)}</p>
        <button
          type="button"
          class="btn btn-primary btn-sm mt-auto boton-agregar"
          data-id="${producto.id}">
          <i class="bi bi-cart-plus me-1" aria-hidden="true"></i>Agregar al carrito
        </button>
      </div>
    </div>
  `;

  return columna;
}

/**
 * Agrega un producto al carrito (o incrementa su cantidad si ya estaba) y
 * refresca el resumen visible en la página.
 */
function agregarAlCarrito(idProducto) {
  const producto = productosOriginales.find((p) => p.id === idProducto);
  if (!producto) return;

  const itemExistente = carrito.find((item) => item.id === idProducto);
  if (itemExistente) {
    itemExistente.cantidad += 1;
  } else {
    carrito.push({ id: producto.id, nombre: producto.nombre, precio: producto.precio, cantidad: 1 });
  }

  actualizarResumenCarrito();
}

/**
 * Repinta la lista del carrito, el total acumulado y el contador de la campanita
 * cada vez que cambia el contenido del carrito.
 */
function actualizarResumenCarrito() {
  listaCarrito.innerHTML = '';

  if (carrito.length === 0) {
    const vacio = document.createElement('li');
    vacio.className = 'list-group-item text-muted';
    vacio.textContent = 'Tu carrito está vacío.';
    listaCarrito.appendChild(vacio);
  }

  let total = 0;
  let cantidadTotal = 0;

  carrito.forEach((item) => {
    const subtotal = item.precio * item.cantidad;
    total += subtotal;
    cantidadTotal += item.cantidad;

    const fila = document.createElement('li');
    fila.className = 'list-group-item d-flex justify-content-between align-items-center';
    fila.textContent = `${item.nombre} x${item.cantidad}`;

    const importe = document.createElement('span');
    importe.className = 'fw-semibold';
    importe.textContent = formatearPrecio(subtotal);

    fila.appendChild(importe);
    listaCarrito.appendChild(fila);
  });

  totalCarrito.textContent = formatearPrecio(total);
  contadorCarrito.textContent = cantidadTotal;
}

/**
 * Maneja el envío del formulario de búsqueda: evita que la página se recargue,
 * filtra el catálogo original por nombre (sin distinguir mayúsculas/minúsculas)
 * y vuelve a renderizar solo los productos que coinciden.
 */
function manejarBusqueda(evento) {
  evento.preventDefault();

  const termino = inputBusqueda.value.trim().toLowerCase();
  if (termino === '') {
    renderizarProductos(productosOriginales);
    return;
  }

  const resultados = productosOriginales.filter((producto) =>
    producto.nombre.toLowerCase().includes(termino)
  );

  renderizarProductos(resultados);
}

/**
 * Filtra el catálogo por categoría al hacer click en un enlace de la navbar
 * que traiga un atributo data-categoria (Tecnología / Hogar).
 */
function filtrarPorCategoria(categoria) {
  const resultados = productosOriginales.filter((producto) => producto.categoria === categoria);
  inputBusqueda.value = '';
  renderizarProductos(resultados);
}

/**
 * Muestra un mensaje de error amigable y visible cuando falla la carga de datos.
 */
function mostrarError(mensaje) {
  alertaCarga.textContent = mensaje;
  alertaCarga.classList.remove('d-none');
}

/**
 * Formatea un número como precio en pesos chilenos (CLP), sin decimales.
 */
function formatearPrecio(valor) {
  return valor.toLocaleString('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 });
}

// ===================== Registro de eventos =====================

document.addEventListener('DOMContentLoaded', cargarProductos);

// Evento "submit" del formulario de búsqueda
formularioBusqueda.addEventListener('submit', manejarBusqueda);

// Enlaces de categoría en la navbar (delegado, por si se agregan más a futuro)
document.querySelectorAll('[data-categoria]').forEach((enlace) => {
  enlace.addEventListener('click', (evento) => {
    evento.preventDefault();
    filtrarPorCategoria(enlace.dataset.categoria);
  });
});

// Evento "click" delegado: como las tarjetas se crean dinámicamente,
// se escucha en el contenedor padre y se identifica el botón con closest().
contenedorProductos.addEventListener('click', (evento) => {
  const boton = evento.target.closest('.boton-agregar');
  if (!boton) return;

  const idProducto = Number(boton.dataset.id);
  agregarAlCarrito(idProducto);
});
