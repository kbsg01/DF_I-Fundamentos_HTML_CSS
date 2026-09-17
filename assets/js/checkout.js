/**
 * Lógica de la pantalla de pago: muestra el resumen del carrito y simula la confirmación del pedido.
 */
/** Muestra el detalle del pedido o un aviso si no existen productos por pagar. */
function renderResumenPedido() {
    const cart = getCart();
    const contenedorVacio = document.getElementById("checkout-vacio");
    const contenedorContenido = document.getElementById("checkout-contenido");
    const resumenItems = document.getElementById("resumen-items");
    const resumenTotal = document.getElementById("resumen-total");

    if (cart.length === 0) {
        contenedorVacio.classList.remove("d-none");
        contenedorContenido.classList.add("d-none");
        return;
    }

    contenedorVacio.classList.add("d-none");
    contenedorContenido.classList.remove("d-none");

    resumenItems.innerHTML = cart
        .map(
            (item) => `
        <div class="d-flex justify-content-between align-items-center border-bottom py-2">
            <div class="d-flex align-items-center gap-2">
                <img src="${item.cover}" alt="Portada de ${item.name}" width="48" height="48" class="rounded">
                <div>
                    <p class="mb-0 small fw-semibold">${item.name}</p>
                    <p class="mb-0 small text-muted">Cantidad: ${item.qty}</p>
                </div>
            </div>
            <span class="fw-semibold">${formatCLP(item.price * item.qty)}</span>
        </div>
    `
        )
        .join("");

    resumenTotal.textContent = formatCLP(getCartTotal());
}

document.addEventListener("DOMContentLoaded", () => {
    renderResumenPedido();

    const formulario = document.getElementById("form-pago");
    // El submit valida los datos obligatorios antes de mostrar la confirmacion y vaciar el carrito.
    formulario.addEventListener("submit", (evento) => {
        evento.preventDefault();
        evento.stopPropagation();

        if (!formulario.checkValidity()) {
            formulario.classList.add("was-validated");
            return;
        }

        document.getElementById("checkout-contenido").classList.add("d-none");
        document.getElementById("checkout-confirmacion").classList.remove("d-none");
        clearCart();
    });
});
