import { beforeEach, describe, expect, it } from 'vitest';
import { GAMES } from './data.js';
import { createGameCard, initCatalog } from './catalog.js';

let filtersEl, gridEl, statusEl;

beforeEach(() => {
  document.body.innerHTML = '<div id="f"></div><p id="s"></p><div id="g"></div>';
  filtersEl = document.getElementById('f');
  gridEl = document.getElementById('g');
  statusEl = document.getElementById('s');
});

describe('createGameCard', () => {
  it('construye la tarjeta con imagen, nombre, categoría, descripción y precio', () => {
    const card = createGameCard(GAMES[0]);
    expect(card.querySelector('img').alt).toBe(`Portada de ${GAMES[0].name}`);
    expect(card.querySelector('img').getAttribute('src')).toBe(`../${GAMES[0].image}`);
    expect(card.querySelector('.card-title').textContent).toBe(GAMES[0].name);
    expect(card.querySelector('.badge').textContent).toBe(GAMES[0].category);
    expect(card.querySelector('.game-price').textContent).toMatch(/\$/);
  });

  it('no interpreta HTML en los textos (prevención de XSS)', () => {
    const card = createGameCard({ ...GAMES[0], name: '<img src=x onerror=alert(1)>' });
    expect(card.querySelector('.card-title img')).toBeNull();
    expect(card.querySelector('.card-title').textContent).toBe('<img src=x onerror=alert(1)>');
  });
});

describe('initCatalog', () => {
  it('muestra todos los juegos y un botón por categoría', () => {
    initCatalog({ games: GAMES, filtersEl, gridEl, statusEl });
    expect(gridEl.children).toHaveLength(GAMES.length);
    expect(filtersEl.querySelectorAll('button').length).toBe(new Set(GAMES.map((g) => g.category)).size + 1);
    expect(statusEl.textContent).toBe(`${GAMES.length} videojuegos encontrados`);
  });

  it('filtra al hacer clic en una categoría', () => {
    initCatalog({ games: GAMES, filtersEl, gridEl, statusEl });
    const category = GAMES[0].category;
    const expected = GAMES.filter((g) => g.category === category).length;
    filtersEl.querySelector(`[data-category="${category}"]`).click();
    expect(gridEl.children).toHaveLength(expected);
    expect(filtersEl.querySelector(`[data-category="${category}"]`).getAttribute('aria-pressed')).toBe('true');
  });
});
