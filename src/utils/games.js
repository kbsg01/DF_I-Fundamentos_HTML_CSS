/**
 * Utilidades puras para trabajar con el catálogo de videojuegos.
 * Se reutilizan en React (src/) y en la versión JavaScript puro (vanilla/).
 */

/** Valor especial del filtro que muestra todo el catálogo. */
export const ALL_CATEGORIES = 'Todas';

/**
 * @typedef {Object} Game
 * @property {number} id         identificador único
 * @property {string} name       nombre del videojuego
 * @property {string} category   categoría (Aventura, RPG, ...)
 * @property {number} price      precio en pesos chilenos (entero)
 * @property {string} description descripción corta
 * @property {string} image      ruta relativa a la imagen de portada
 */

/**
 * Devuelve las categorías únicas en orden alfabético (es-CL), precedidas por "Todas".
 * @param {Game[]} games
 * @returns {string[]}
 */
export function getCategories(games) {
  const unique = [...new Set(games.map((g) => g.category))];
  unique.sort((a, b) => a.localeCompare(b, 'es'));
  return [ALL_CATEGORIES, ...unique];
}

/**
 * Filtra los videojuegos por categoría sin mutar el arreglo original.
 * @param {Game[]} games
 * @param {string} category categoría seleccionada o "Todas"
 * @returns {Game[]}
 */
export function filterByCategory(games, category) {
  if (!category || category === ALL_CATEGORIES) return [...games];
  return games.filter((g) => g.category === category);
}

/**
 * Formatea un precio en pesos chilenos (ej.: $29.990).
 * @param {number} value
 * @returns {string}
 */
export function formatPrice(value) {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Calcula el siguiente id disponible (máximo actual + 1).
 * @param {Game[]} games
 * @returns {number}
 */
export function nextId(games) {
  return games.reduce((max, g) => Math.max(max, g.id), 0) + 1;
}

/**
 * Defensa ante datos externos (archivo/API): conserva solo registros con la forma esperada.
 * @param {unknown} data
 * @returns {Game[]}
 */
export function sanitizeGames(data) {
  if (!Array.isArray(data)) return [];
  return data
    .filter(
      (g) =>
        g &&
        Number.isInteger(g.id) &&
        typeof g.name === 'string' &&
        typeof g.category === 'string' &&
        Number.isFinite(g.price) &&
        g.price >= 0 &&
        typeof g.description === 'string' &&
        typeof g.image === 'string',
    )
    .map((g) => ({
      id: g.id,
      name: g.name,
      category: g.category,
      price: g.price,
      description: g.description,
      image: g.image,
    }));
}
