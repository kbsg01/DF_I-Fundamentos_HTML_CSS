import { describe, expect, it } from 'vitest';
import { validateContact, validateGame } from './validation.js';

const validContact = { nombre: 'Karla Pérez', email: 'karla@correo.cl', mensaje: 'Hola, quisiera consultar por stock.' };

describe('validateContact', () => {
  it('acepta datos válidos', () => {
    expect(validateContact(validContact)).toEqual({ valid: true, errors: {} });
  });
  it('exige todos los campos', () => {
    const { valid, errors } = validateContact({});
    expect(valid).toBe(false);
    expect(Object.keys(errors).sort()).toEqual(['email', 'mensaje', 'nombre']);
  });
  it('rechaza correos mal formados', () => {
    for (const email of ['sin-arroba', 'a@b', 'a b@c.cl', '@dominio.cl']) {
      expect(validateContact({ ...validContact, email }).errors.email).toBeDefined();
    }
  });
  it('rechaza nombres con símbolos o HTML', () => {
    expect(validateContact({ ...validContact, nombre: '<script>alert(1)</script>' }).errors.nombre).toBeDefined();
  });
  it('acepta tildes, ñ y apóstrofes en el nombre', () => {
    expect(validateContact({ ...validContact, nombre: "María-José Ñuñoa O'Higgins" }).valid).toBe(true);
  });
  it('valida largo mínimo y máximo del mensaje', () => {
    expect(validateContact({ ...validContact, mensaje: 'corto' }).errors.mensaje).toMatch(/al menos/);
    expect(validateContact({ ...validContact, mensaje: 'x'.repeat(501) }).errors.mensaje).toMatch(/superar/);
  });
  it('ignora espacios laterales', () => {
    expect(validateContact({ ...validContact, nombre: '   ' }).errors.nombre).toMatch(/obligatorio/);
  });
  it('rechaza caracteres de control', () => {
    expect(validateContact({ ...validContact, mensaje: 'mensaje con nulo \u0000 dentro' }).errors.mensaje).toBeDefined();
  });
});

describe('validateGame', () => {
  const valid = { name: 'Juego Nuevo', category: 'RPG', price: '19990', description: 'Una descripción suficiente.' };
  const categories = ['RPG', 'Acción'];

  it('acepta un juego válido', () => {
    expect(validateGame(valid, categories).valid).toBe(true);
  });
  it('rechaza precios no enteros, negativos, cero o excesivos', () => {
    for (const price of ['10.5', '-1', '0', '1000001', 'abc']) {
      expect(validateGame({ ...valid, price }, categories).errors.price).toBeDefined();
    }
  });
  it('rechaza categorías fuera de la lista permitida', () => {
    expect(validateGame({ ...valid, category: 'Terror' }, categories).errors.category).toBeDefined();
  });
  it('exige todos los campos', () => {
    expect(Object.keys(validateGame({}, categories).errors).sort()).toEqual(['category', 'description', 'name', 'price']);
  });
});
