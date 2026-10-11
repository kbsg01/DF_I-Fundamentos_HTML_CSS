import { describe, expect, it } from 'vitest';
import { ALL_CATEGORIES, filterByCategory, formatPrice, getCategories, nextId, sanitizeGames } from './games.js';

const sample = [
  { id: 1, name: 'A', category: 'RPG', price: 1000, description: 'd', image: 'img/a.svg' },
  { id: 2, name: 'B', category: 'Acción', price: 2000, description: 'd', image: 'img/b.svg' },
  { id: 5, name: 'C', category: 'RPG', price: 3000, description: 'd', image: 'img/c.svg' },
];

describe('getCategories', () => {
  it('devuelve "Todas" primero y las categorías únicas ordenadas', () => {
    expect(getCategories(sample)).toEqual([ALL_CATEGORIES, 'Acción', 'RPG']);
  });
  it('con catálogo vacío solo devuelve "Todas"', () => {
    expect(getCategories([])).toEqual([ALL_CATEGORIES]);
  });
});

describe('filterByCategory', () => {
  it('filtra por categoría', () => {
    expect(filterByCategory(sample, 'RPG').map((g) => g.id)).toEqual([1, 5]);
  });
  it('"Todas" devuelve una copia completa sin mutar el original', () => {
    const result = filterByCategory(sample, ALL_CATEGORIES);
    expect(result).toEqual(sample);
    expect(result).not.toBe(sample);
  });
  it('categoría inexistente devuelve lista vacía', () => {
    expect(filterByCategory(sample, 'Terror')).toEqual([]);
  });
});

describe('formatPrice', () => {
  it('formatea en pesos chilenos sin decimales', () => {
    // Intl puede usar espacio normal o no separable entre símbolo y número según el runtime
    expect(formatPrice(29990).replace(/\s/g, '')).toBe('$29.990');
  });
});

describe('nextId', () => {
  it('usa el máximo actual + 1 (aunque haya huecos)', () => {
    expect(nextId(sample)).toBe(6);
  });
  it('empieza en 1 con catálogo vacío', () => {
    expect(nextId([])).toBe(1);
  });
});

describe('sanitizeGames', () => {
  it('descarta datos que no son un arreglo', () => {
    expect(sanitizeGames(null)).toEqual([]);
    expect(sanitizeGames({})).toEqual([]);
  });
  it('conserva registros válidos y descarta los mal formados', () => {
    const dirty = [...sample, { id: 'x', name: 1 }, null, { ...sample[0], id: 9, price: -5 }];
    expect(sanitizeGames(dirty)).toHaveLength(3);
  });
  it('elimina propiedades inesperadas', () => {
    const [clean] = sanitizeGames([{ ...sample[0], isAdmin: true }]);
    expect(clean).not.toHaveProperty('isAdmin');
  });
});
