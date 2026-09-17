/**
 * Buscador del catálogo: filtra por nombre sobre el catálogo ya cargado por game_db.js
 * y muestra los resultados en una fila independiente, sin volver a llamar a la Fetch API.
 */

/** Filtra catalogoCompleto por nombre y pinta los resultados (o un aviso si no hay coincidencias). */
function buscarJuegos(termino) {
    const seccionResultados = document.getElementById("seccion-resultados");
    const filaResultados = document.getElementById("row-resultados");
    const contenedorCategorias = document.getElementById("contenedor-categorias");
    const terminoNormalizado = termino.trim().toLowerCase();

    // Búsqueda vacía: se restaura el catálogo agrupado por categoría.
    if (terminoNormalizado === "") {
        seccionResultados.classList.add("d-none");
        contenedorCategorias.classList.remove("d-none");
        return;
    }

    const encontrados = catalogoCompleto.filter((game) =>
        game.name.toLowerCase().includes(terminoNormalizado)
    );

    contenedorCategorias.classList.add("d-none");
    seccionResultados.classList.remove("d-none");
    filaResultados.replaceChildren();

    if (encontrados.length === 0) {
        const aviso = document.createElement("p");
        aviso.className = "text-muted";
        aviso.textContent = `No se encontraron videojuegos para "${termino}".`;
        filaResultados.appendChild(aviso);
        setCatalogStatus(`Sin resultados para "${termino}".`);
        return;
    }

    encontrados.forEach((game) => filaResultados.appendChild(createGameCard(game)));
    setCatalogStatus(`${encontrados.length} resultado(s) para "${termino}".`);
}

document.addEventListener("DOMContentLoaded", () => {
    const formulario = document.getElementById("form-busqueda");
    const input = document.getElementById("input-busqueda");
    if (!formulario || !input) return;

    // Evento "submit": procesa el formulario de búsqueda sin recargar la página.
    formulario.addEventListener("submit", (evento) => {
        evento.preventDefault();
        buscarJuegos(input.value);
    });
});
