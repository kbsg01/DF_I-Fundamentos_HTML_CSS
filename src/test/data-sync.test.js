import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { GAMES } from '../../vanilla/js/data.js';
import { sanitizeGames } from '../utils/games.js';

describe('catálogo', () => {
  const json = JSON.parse(readFileSync('public/data/games.json', 'utf8'));

  it('el objeto JS (versión pura) y el JSON (versión React) son idénticos', () => {
    expect(GAMES).toEqual(json);
  });
  it('todos los registros tienen la forma esperada', () => {
    expect(sanitizeGames(json)).toHaveLength(json.length);
  });
  it('cada portada referenciada existe en public/', () => {
    for (const game of json) expect(() => readFileSync(`public/${game.image}`)).not.toThrow();
  });
  it('los ids son únicos', () => {
    expect(new Set(json.map((g) => g.id)).size).toBe(json.length);
  });
});
