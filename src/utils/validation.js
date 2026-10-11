/**
 * Validaciones puras (sin DOM ni React) compartidas por la versión React y la versión
 * JavaScript puro. Al ser funciones puras son fáciles de probar con Vitest.
 *
 * Principio de seguridad: la validación en el cliente mejora la experiencia de usuario,
 * pero NO reemplaza la validación en el servidor (aquí no hay backend: el envío es simulado).
 */

export const LIMITS = Object.freeze({
  nombre: { min: 2, max: 60 },
  email: { max: 254 },
  mensaje: { min: 10, max: 500 },
  gameName: { min: 2, max: 60 },
  gameDescription: { min: 10, max: 200 },
  priceMax: 1_000_000,
});

// Letras (con tildes y ñ), espacios, apóstrofes, puntos y guiones.
const NAME_REGEX = /^\p{L}[\p{L}\s'’.-]*$/u;
// Formato práctico: algo@dominio.tld (sin espacios). RFC completo es innecesario en el cliente.
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
// Caracteres de control (excepto salto de línea y tabulación) no son válidos en texto libre.
// eslint-disable-next-line no-control-regex
const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/;

/** @param {unknown} value @returns {string} texto sin espacios laterales ('' si no es string) */
const clean = (value) => (typeof value === 'string' ? value.trim() : '');

/**
 * @typedef {{ valid: boolean, errors: Record<string, string> }} ValidationResult
 */

/**
 * Valida el formulario de contacto.
 * @param {{nombre?: string, email?: string, mensaje?: string}} data
 * @returns {ValidationResult}
 */
export function validateContact(data = {}) {
  const errors = {};
  const nombre = clean(data.nombre);
  const email = clean(data.email);
  const mensaje = clean(data.mensaje);

  if (!nombre) errors.nombre = 'El nombre es obligatorio.';
  else if (nombre.length < LIMITS.nombre.min || nombre.length > LIMITS.nombre.max)
    errors.nombre = `El nombre debe tener entre ${LIMITS.nombre.min} y ${LIMITS.nombre.max} caracteres.`;
  else if (!NAME_REGEX.test(nombre))
    errors.nombre = 'El nombre solo puede contener letras, espacios, puntos, apóstrofes y guiones.';

  if (!email) errors.email = 'El correo electrónico es obligatorio.';
  else if (email.length > LIMITS.email.max || !EMAIL_REGEX.test(email))
    errors.email = 'Ingresa un correo válido, por ejemplo nombre@dominio.cl.';

  if (!mensaje) errors.mensaje = 'El mensaje es obligatorio.';
  else if (mensaje.length < LIMITS.mensaje.min)
    errors.mensaje = `El mensaje debe tener al menos ${LIMITS.mensaje.min} caracteres.`;
  else if (mensaje.length > LIMITS.mensaje.max)
    errors.mensaje = `El mensaje no puede superar los ${LIMITS.mensaje.max} caracteres.`;
  else if (CONTROL_CHARS.test(mensaje)) errors.mensaje = 'El mensaje contiene caracteres no permitidos.';

  return { valid: Object.keys(errors).length === 0, errors };
}

/**
 * Valida un videojuego antes de agregarlo al catálogo.
 * @param {{name?: string, category?: string, price?: string|number, description?: string}} data
 * @param {string[]} allowedCategories categorías permitidas
 * @returns {ValidationResult}
 */
export function validateGame(data = {}, allowedCategories = []) {
  const errors = {};
  const name = clean(data.name);
  const description = clean(data.description);
  const price = Number(data.price);

  if (!name) errors.name = 'El nombre del juego es obligatorio.';
  else if (name.length < LIMITS.gameName.min || name.length > LIMITS.gameName.max)
    errors.name = `El nombre debe tener entre ${LIMITS.gameName.min} y ${LIMITS.gameName.max} caracteres.`;
  else if (CONTROL_CHARS.test(name)) errors.name = 'El nombre contiene caracteres no permitidos.';

  if (!clean(data.category)) errors.category = 'Selecciona una categoría.';
  else if (allowedCategories.length > 0 && !allowedCategories.includes(clean(data.category)))
    errors.category = 'La categoría seleccionada no es válida.';

  if (data.price === '' || data.price === undefined || data.price === null)
    errors.price = 'El precio es obligatorio.';
  else if (!Number.isInteger(price) || price <= 0 || price > LIMITS.priceMax)
    errors.price = `El precio debe ser un número entero entre 1 y ${LIMITS.priceMax.toLocaleString('es-CL')} (CLP).`;

  if (!description) errors.description = 'La descripción es obligatoria.';
  else if (description.length < LIMITS.gameDescription.min || description.length > LIMITS.gameDescription.max)
    errors.description = `La descripción debe tener entre ${LIMITS.gameDescription.min} y ${LIMITS.gameDescription.max} caracteres.`;
  else if (CONTROL_CHARS.test(description)) errors.description = 'La descripción contiene caracteres no permitidos.';

  return { valid: Object.keys(errors).length === 0, errors };
}
