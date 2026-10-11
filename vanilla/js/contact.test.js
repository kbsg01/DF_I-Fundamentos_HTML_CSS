import { beforeEach, describe, expect, it } from 'vitest';
import { initContactForm } from './contact.js';

function setup() {
  document.body.innerHTML = `
    <form id="f" novalidate>
      <input name="nombre" id="contacto-nombre" /><div id="contacto-nombre-error"></div>
      <input name="email" id="contacto-email" /><div id="contacto-email-error"></div>
      <textarea name="mensaje" id="contacto-mensaje"></textarea><div id="contacto-mensaje-error"></div>
      <button type="submit">Enviar</button>
    </form><div id="estado"></div>`;
  const form = document.getElementById('f');
  initContactForm(form, document.getElementById('estado'));
  return form;
}
const submit = (form) => form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));

describe('initContactForm', () => {
  let form;
  beforeEach(() => {
    form = setup();
  });

  it('muestra errores y marca los campos inválidos cuando falta información', () => {
    submit(form);
    expect(form.elements.nombre.classList.contains('is-invalid')).toBe(true);
    expect(form.elements.email.getAttribute('aria-invalid')).toBe('true');
    expect(document.getElementById('contacto-mensaje-error').textContent).toMatch(/obligatorio/);
    expect(document.activeElement).toBe(form.elements.nombre);
  });

  it('confirma el envío con datos válidos y limpia el formulario', () => {
    form.elements.nombre.value = 'Karla Pérez';
    form.elements.email.value = 'karla@correo.cl';
    form.elements.mensaje.value = 'Mensaje de prueba suficientemente largo.';
    submit(form);
    expect(document.getElementById('estado').textContent).toMatch(/validado correctamente/);
    expect(form.elements.nombre.value).toBe('');
  });

  it('quita el error al corregir el campo y salir de él', () => {
    submit(form);
    form.elements.email.value = 'karla@correo.cl';
    form.elements.email.dispatchEvent(new Event('blur'));
    expect(form.elements.email.classList.contains('is-invalid')).toBe(false);
  });
});
