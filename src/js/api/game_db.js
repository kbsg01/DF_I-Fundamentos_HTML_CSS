/** Actualiza la zona accesible con el estado de la carga o la interaccion del catalogo. */
function setCatalogStatus(message, isError = false) {
    const status = document.getElementById("catalog-status");
    if (!status) return;

    status.textContent = message;
    status.classList.toggle("text-danger", isError);
    status.classList.toggle("text-muted", !isError);
}

/** Crea una tarjeta de videojuego con createElement para insertarla dinamicamente en el DOM. */
function createGameCard(game) {
    const column = document.createElement("div");
    column.className = "col";

    const card = document.createElement("article");
    card.className = "card h-100 shadow-sm";
    card.tabIndex = 0;

    const cover = document.createElement("img");
    cover.src = game.cover;
    cover.className = "card-img-top";
    cover.alt = `Portada del videojuego ${game.name}`;
    cover.loading = "lazy";

    const body = document.createElement("div");
    body.className = "card-body d-flex flex-column";

    const title = document.createElement("h4");
    title.className = "card-title h6";
    title.textContent = game.name;

    const description = document.createElement("p");
    description.className = "card-text text-muted small flex-grow-1";
    description.textContent = game.description;

    const price = document.createElement("p");
    price.className = "fw-bold mb-2";
    price.textContent = `Precio: ${game.price}`;

    const button = document.createElement("button");
    button.type = "button";
    button.className = "btn btn-primary btn-sm mt-auto btn-add-cart";
    button.dataset.id = game.id;
    button.dataset.name = game.name;
    button.dataset.price = game.priceValue;
    button.dataset.cover = game.cover;
    button.innerHTML = '<i class="bi bi-cart-plus" aria-hidden="true"></i> Agregar al carrito';

    // Resalta la tarjeta activa y entrega informacion contextual al pasar el mouse.
    card.addEventListener("mouseover", () => {
        card.classList.add("border-primary");
        setCatalogStatus(`${game.name}: ${game.description}`);
    });
    card.addEventListener("mouseleave", () => card.classList.remove("border-primary"));

    body.append(title, description, price, button);
    card.append(cover, body);
    column.appendChild(card);
    return column;
}

/** Inserta con appendChild los juegos de una categoria en el contenedor indicado. */
function renderGamesByCategory(games, containerId, category) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.replaceChildren();
    games
        .filter((game) => game.category === category)
        .forEach((game) => container.appendChild(createGameCard(game)));
}

/** Obtiene los juegos con Fetch API, los muestra en la pagina y controla posibles errores. */
function loadGames() {
    setCatalogStatus("Cargando catalogo de videojuegos...");

    return fetch("./data/games.json")
        .then((response) => {
            if (!response.ok) throw new Error(`Error HTTP ${response.status}`);
            return response.json();
        })
        .then((games) => {
            renderGamesByCategory(games, "row-accion", "Accion");
            renderGamesByCategory(games, "row-aventura", "Aventura");
            renderGamesByCategory(games, "row-deportes", "Deportes");
            setCatalogStatus(`${games.length} videojuegos cargados correctamente.`);
        })
        .catch((error) => {
            console.error("No se pudo cargar el catalogo:", error);
            setCatalogStatus("No fue posible cargar el catalogo. Recarga la pagina e intentalo nuevamente.", true);
        });
}

/** Inicia la carga cuando el documento termina de construirse. */
document.addEventListener("DOMContentLoaded", loadGames);
