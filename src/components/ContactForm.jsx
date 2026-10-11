import { useState } from 'react';
import Field from './Field.jsx';
import { useForm } from '../hooks/useForm.js';
import { LIMITS, validateContact } from '../utils/validation.js';

const INITIAL_VALUES = { nombre: '', email: '', mensaje: '' };

/**
 * Formulario de contacto con validación antes del envío.
 * El envío es simulado (no existe backend en esta evaluación): en un proyecto real,
 * los datos se enviarían por HTTPS y se validarían nuevamente en el servidor.
 */
export default function ContactForm() {
  const [sent, setSent] = useState(false);
  const form = useForm(INITIAL_VALUES, validateContact);

  // Al volver a escribir se oculta el mensaje de éxito anterior
  const handleChange = (event) => {
    setSent(false);
    form.handleChange(event);
  };

  const onValid = () => {
    setSent(true);
    form.reset();
  };

  return (
    <form noValidate onSubmit={form.handleSubmit(onValid)} aria-describedby="contacto-estado">
      <Field
        id="contacto-nombre"
        label="Nombre"
        name="nombre"
        type="text"
        autoComplete="name"
        maxLength={LIMITS.nombre.max}
        value={form.values.nombre}
        error={form.errorFor('nombre')}
        onChange={handleChange}
        onBlur={form.handleBlur}
      />
      <Field
        id="contacto-email"
        label="Correo electrónico"
        name="email"
        type="email"
        autoComplete="email"
        maxLength={LIMITS.email.max}
        value={form.values.email}
        error={form.errorFor('email')}
        onChange={handleChange}
        onBlur={form.handleBlur}
      />
      <Field
        id="contacto-mensaje"
        as="textarea"
        label="Mensaje"
        name="mensaje"
        rows={4}
        maxLength={LIMITS.mensaje.max}
        hint={`Entre ${LIMITS.mensaje.min} y ${LIMITS.mensaje.max} caracteres.`}
        value={form.values.mensaje}
        error={form.errorFor('mensaje')}
        onChange={handleChange}
        onBlur={form.handleBlur}
      />
      <button type="submit" className="btn btn-accent">
        Enviar mensaje
      </button>
      <div id="contacto-estado" role="status" aria-live="polite" className="mt-3">
        {sent && (
          <div className="alert alert-success mb-0">
            ¡Gracias! Tu mensaje fue validado correctamente (envío simulado).
          </div>
        )}
      </div>
    </form>
  );
}
