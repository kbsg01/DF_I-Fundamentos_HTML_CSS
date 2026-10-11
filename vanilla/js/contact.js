/**
 * Formulario de contacto con JavaScript puro: valida con la misma función pura que usa React
 * (src/utils/validation.js) y muestra los errores con clases de Bootstrap (`is-invalid`).
 */
import { validateContact } from '../../src/utils/validation.js';

const FIELDS = ['nombre', 'email', 'mensaje'];

/**
 * Muestra u oculta el error de un campo y sincroniza atributos ARIA.
 * @param {HTMLFormElement} form
 * @param {string} field
 * @param {string | undefined} message
 */
function showFieldError(form, field, message) {
  const input = form.elements[field];
  const feedback = form.querySelector(`#contacto-${field}-error`);
  input.classList.toggle('is-invalid', Boolean(message));
  if (message) input.setAttribute('aria-invalid', 'true');
  else input.removeAttribute('aria-invalid');
  feedback.textContent = message ?? '';
  feedback.classList.toggle('d-block', Boolean(message));
}

/**
 * @param {HTMLFormElement} form
 * @param {HTMLElement} statusEl región donde se informa el resultado del envío
 */
export function initContactForm(form, statusEl) {
  const readValues = () => Object.fromEntries(FIELDS.map((field) => [field, form.elements[field].value]));

  // Validación en vivo al salir de un campo (mejora la experiencia sin ser intrusiva)
  for (const field of FIELDS) {
    form.elements[field].addEventListener('blur', () => {
      showFieldError(form, field, validateContact(readValues()).errors[field]);
    });
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const { valid, errors } = validateContact(readValues());
    for (const field of FIELDS) showFieldError(form, field, errors[field]);

    if (!valid) {
      statusEl.replaceChildren();
      // Lleva el foco al primer campo con error para facilitar la corrección
      const firstInvalid = FIELDS.find((field) => errors[field]);
      form.elements[firstInvalid].focus();
      return;
    }

    form.reset();
    const alert = document.createElement('div');
    alert.className = 'alert alert-success mb-0';
    alert.textContent = '¡Gracias! Tu mensaje fue validado correctamente (envío simulado).';
    statusEl.replaceChildren(alert);
  });
}
