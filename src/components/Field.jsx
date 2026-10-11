/**
 * Campo de formulario accesible: etiqueta, control, texto de ayuda y mensaje de error
 * enlazados con aria-describedby / aria-invalid (WCAG 2.1: 1.3.1, 3.3.1, 3.3.3).
 *
 * @param {object} props
 * @param {string} props.id identificador único (une label y control)
 * @param {string} props.label texto visible de la etiqueta
 * @param {'input'|'textarea'|'select'} [props.as] tipo de control
 * @param {string} [props.error] mensaje de error (si existe, el campo se marca inválido)
 * @param {string} [props.hint] texto de ayuda
 * @param {import('react').ReactNode} [props.children] opciones para <select>
 */
export default function Field({ id, label, as = 'input', error, hint, children, ...controlProps }) {
  const Control = as;
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;
  const controlClass = as === 'select' ? 'form-select' : 'form-control';

  return (
    <div className="mb-3">
      <label htmlFor={id} className="form-label">
        {label}
      </label>
      <Control
        id={id}
        className={`${controlClass}${error ? ' is-invalid' : ''}`}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={describedBy}
        {...controlProps}
      >
        {children}
      </Control>
      {hint && (
        <div id={hintId} className="form-text">
          {hint}
        </div>
      )}
      {error && (
        <div id={errorId} className="invalid-feedback d-block" role="alert">
          {error}
        </div>
      )}
    </div>
  );
}
