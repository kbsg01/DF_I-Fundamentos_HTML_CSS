import { useCallback, useState } from 'react';

/**
 * Hook reutilizable para formularios controlados con validación.
 * Lo usan ContactForm y AddGameForm, de modo que la lógica no se duplica.
 *
 * @template {Record<string, string>} T
 * @param {T} initialValues valores iniciales (también sirven para reiniciar el formulario)
 * @param {(values: T) => { valid: boolean, errors: Record<string, string> }} validate función pura de validación
 */
export function useForm(initialValues, validate) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = useCallback(
    (event) => {
      const { name, value } = event.target;
      const next = { ...values, [name]: value };
      setValues(next);
      // Si el campo ya fue tocado, se revalida en vivo para que el error desaparezca al corregirlo
      if (touched[name]) setErrors(validate(next).errors);
    },
    [values, touched, validate],
  );

  const handleBlur = useCallback(
    (event) => {
      const { name } = event.target;
      setTouched((prev) => ({ ...prev, [name]: true }));
      setErrors(validate(values).errors);
    },
    [values, validate],
  );

  /** Devuelve un manejador de submit que solo invoca onValid si no hay errores. */
  const handleSubmit = useCallback(
    (onValid) => (event) => {
      event.preventDefault();
      const result = validate(values);
      setErrors(result.errors);
      setTouched(Object.fromEntries(Object.keys(values).map((key) => [key, true])));
      if (result.valid) onValid(values);
    },
    [values, validate],
  );

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  /** Error visible solo para campos tocados (evita mostrar errores antes de interactuar). */
  const errorFor = (name) => (touched[name] ? errors[name] : undefined);

  return { values, errorFor, handleChange, handleBlur, handleSubmit, reset };
}
