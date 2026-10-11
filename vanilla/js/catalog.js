/**
 * Catálogo con JavaScript puro: genera tarjetas Bootstrap y botones de filtro usando la API del DOM.
 *
 * Seguridad: todo el texto se inserta con `textContent` (nunca con `innerHTML`), de modo que
 * un nombre o descripción con HTML no se interpreta como código (previene XSS basado en DOM).
 */
import { ALL_CATEGORIES, filterByCategory, formatPrice, getCategories } from '../../src/utils/games.js';

/**
 * Crea un elemento con clases y texto opcionales.
 * @param {string} tag
 * @param {string} [className]
 * @param {string} [text]
 * @returns {HTMLElement}
 */
function el(tag, className = '', text = '') {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}

/**
 * Construye la tarjeta (card de Bootstrap) de un videojuego.
 * @param {import('../../src/utils/games.js').Game} game
 * @param {string} [imageBase] prefijo de ruta para las imágenes (esta página vive en /vanilla/)
 * @returns {HTMLElement}
 */
export function createGameCard(game, imageBase = '../') {
  const card = el('article', 'card h-100 game-card');

  const img = el('img', 'card-img-top');
  img.src = `${imageBase}${game.image}`;
  img.alt = `Portada de ${game.name}`;
  img.width = 600;
  img.height = 400;
  img.loading = 'lazy';

  const body = el('div', 'card-body d-flex flex-column');
  const badge = el('span', 'badge text-bg-secondary align-self-start mb-2', game.category);
  const title = el('h3', 'card-title h5', game.name);
  const text = el('p', 'card-text flex-grow-1', game.description);
  const price = el('strong', 'game-price', formatPrice(game.price));

  body.append(badge, title, text, price);
  card.append(img, body);
  return card;
}

/**
 * Dibuja las tarjetas en el contenedor, reemplazando el contenido anterior.
 * @param {HTMLElement} container
 * @param {import('../../src/utils/games.js').Game[]} games
 * @param {string} [imageBase]
 */
export function renderGames(container, games, imageBase = '../') {
  const cards = games.map((game) => createGameCard(game, imageBase));
  container.replaceChildren(...cards);
}

/**
 * Inicializa botones de filtro y catálogo. Devuelve una función para seleccionar categoría
 * (útil en pruebas).
 * @param {{ games: import('../../src/utils/games.js').Game[], filtersEl: HTMLElement, gridEl: HTMLElement, statusEl: HTMLElement, imageBase?: string }} options
 * @returns {(category: string) => void}
 */
export function initCatalog({ games, filtersEl, gridEl, statusEl, imageBase = '../' }) {
  const categories = getCategories(games);

  const select = (category) => {
    const visible = filterByCategory(games, category);
    renderGames(gridEl, visible, imageBase);
    statusEl.textContent = visible.length === 1 ? '1 videojuego encontrado' : `${visible.length} videojuegos encontrados`;
    // Actualiza el estado visual y de accesibilidad de cada botón
    for (const button of filtersEl.querySelectorAll('button')) {
      const active = button.dataset.category === category;
      button.setAttribute('aria-pressed', String(active));
      button.className = `btn btn-sm ${active ? 'btn-accent' : 'btn-outline-light'}`;
    }
  };

  const buttons = categories.map((category) => {
    const button = el('button', 'btn btn-sm btn-outline-light', category);
    button.type = 'button';
    button.dataset.category = category;
    button.addEventListener('click', () => select(category));
    return button;
  });
  filtersEl.replaceChildren(...buttons);

  select(ALL_CATEGORIES);
  return select;
}
