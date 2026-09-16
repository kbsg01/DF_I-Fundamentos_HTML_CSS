/**
 * Carrito de compras dinámico persistido en localStorage (sin backend).
 * El carrito se comparte entre index.html y checkout.html mediante la misma clave.
 */
const CART_STORAGE_KEY = "gameStoreCart";

/** Recupera el carrito guardado y evita fallos si localStorage contiene datos invalidos. */
function getCart() {
    try {
        return JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || [];
    } catch {
        return [];
    }
}

/** Persiste el arreglo actualizado del carrito en el navegador. */
function saveCart(cart) {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

/** Agrega un producto nuevo o incrementa su cantidad cuando ya existe. */
function addToCart(item) {
    const cart = getCart();
    const existente = cart.find((producto) => producto.id === item.id);
    if (existente) {
        existente.qty += 1;
    } else {
        cart.push({ ...item, qty: 1 });
    }
    saveCart(cart);
    renderCartBadge();
    renderCartOffcanvas();
}

/** Elimina por completo un producto identificado por su id. */
function removeFromCart(id) {
    saveCart(getCart().filter((producto) => producto.id !== id));
    renderCartBadge();
    renderCartOffcanvas();
}

/** Modifica la cantidad de un producto y lo quita al llegar a cero. */
function changeQty(id, delta) {
    const cart = getCart();
    const producto = cart.find((item) => item.id === id);
    if (!producto) return;
    producto.qty += delta;
    const cartFiltrado = producto.qty <= 0 ? cart.filter((item) => item.id !== id) : cart;
    saveCart(cartFiltrado);
    renderCartBadge();
    renderCartOffcanvas();
}

/** Vacía el carrito y actualiza los componentes visuales relacionados. */
function clearCart() {
    saveCart([]);
    renderCartBadge();
    renderCartOffcanvas();
}

/** Calcula el numero total de unidades para mostrarlo en la insignia del carrito. */
function getCartCount() {
    return getCart().reduce((total, item) => total + item.qty, 0);
}

/** Suma los subtotales de todos los productos del carrito. */
function getCartTotal() {
    return getCart().reduce((total, item) => total + item.price * item.qty, 0);
}

/** Formatea valores numericos en pesos chilenos o como producto gratuito. */
function formatCLP(valor) {
    return valor === 0 ? "Gratis" : `$${valor.toLocaleString("es-CL")}`;
}

/** Actualiza u oculta la insignia de cantidad ubicada en la barra de navegacion. */
function renderCartBadge() {
    const badge = document.getElementById("cart-count");
    if (!badge) return;
    const cantidad = getCartCount();
    badge.textContent = cantidad;
    badge.classList.toggle("d-none", cantidad === 0);
}

/** Genera el contenido del panel lateral con controles para modificar el carrito. */
function renderCartOffcanvas() {
    const contenedor = document.getElementById("cart-items");
    const totalEl = document.getElementById("cart-total");
    const btnPagar = document.getElementById("btn-ir-a-pagar");
    if (!contenedor) return;

    const cart = getCart();
    if (cart.length === 0) {
        contenedor.innerHTML = `<p class="text-muted text-center mb-0">Tu carrito está vacío.</p>`;
    } else {
        contenedor.innerHTML = cart
            .map(
                (item) => `
            <div class="d-flex align-items-center gap-2 border-bottom py-2">
                <img src="${item.cover}" alt="Portada de ${item.name}" width="56" height="56" class="rounded object-fit-cover flex-shrink-0">
                <div class="flex-grow-1">
                    <p class="mb-1 small fw-semibold">${item.name}</p>
                    <div class="d-flex align-items-center gap-2">
                        <button type="button" class="btn btn-outline-secondary btn-sm btn-qty-menos" data-id="${item.id}" aria-label="Restar unidad de ${item.name}">-</button>
                        <span>${item.qty}</span>
                        <button type="button" class="btn btn-outline-secondary btn-sm btn-qty-mas" data-id="${item.id}" aria-label="Sumar unidad de ${item.name}">+</button>
                        <span class="ms-auto small text-muted">${formatCLP(item.price * item.qty)}</span>
                    </div>
                </div>
                <button type="button" class="btn btn-link text-danger btn-eliminar-item" data-id="${item.id}" aria-label="Eliminar ${item.name} del carrito">
                    <i class="bi bi-trash" aria-hidden="true"></i>
                </button>
            </div>
        `
            )
            .join("");
    }

    if (totalEl) totalEl.textContent = formatCLP(getCartTotal());
    if (btnPagar) btnPagar.classList.toggle("disabled", cart.length === 0);
}

document.addEventListener("click", (evento) => {
    const botonAgregar = evento.target.closest(".btn-add-cart");
    if (botonAgregar) {
        addToCart({
            id: botonAgregar.dataset.id,
            name: botonAgregar.dataset.name,
            price: Number(botonAgregar.dataset.price),
            cover: botonAgregar.dataset.cover
        });
        if (typeof setCatalogStatus === "function") {
            setCatalogStatus(`${botonAgregar.dataset.name} se agrego al carrito.`);
        }
        return;
    }

    const botonMas = evento.target.closest(".btn-qty-mas");
    if (botonMas) return changeQty(botonMas.dataset.id, 1);

    const botonMenos = evento.target.closest(".btn-qty-menos");
    if (botonMenos) return changeQty(botonMenos.dataset.id, -1);

    const botonEliminar = evento.target.closest(".btn-eliminar-item");
    if (botonEliminar) return removeFromCart(botonEliminar.dataset.id);

    const botonVaciar = evento.target.closest("#btn-vaciar-carrito");
    if (botonVaciar) return clearCart();
});

document.addEventListener("DOMContentLoaded", () => {
    renderCartBadge();
    renderCartOffcanvas();
});
