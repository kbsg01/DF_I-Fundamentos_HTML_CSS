import { useMemo, useState } from 'react';
import Field from './Field.jsx';
import { useForm } from '../hooks/useForm.js';
import { LIMITS, validateGame } from '../utils/validation.js';

const INITIAL_VALUES = { name: '', category: '', price: '', description: '' };
/** Portada genérica para los juegos agregados por el usuario. */
const PLACEHOLDER_IMAGE = 'img/placeholder.svg';

/**
 * Formulario para agregar un videojuego al catálogo (parte "state" de la rúbrica de React).
 * Comunica el nuevo juego al padre mediante `onAdd`; no conoce cómo se almacena el catálogo.
 *
 * @param {object} props
 * @param {string[]} props.categories categorías existentes (sin "Todas")
 * @param {(game: Omit<import('../utils/games.js').Game, 'id'>) => void} props.onAdd
 */
export default function AddGameForm({ categories, onAdd }) {
  const [lastAdded, setLastAdded] = useState('');
  // validateGame depende de las categorías permitidas: se memoiza para mantener una referencia estable
  const validate = useMemo(() => (values) => validateGame(values, categories), [categories]);
  const form = useForm(INITIAL_VALUES, validate);

  const onValid = (values) => {
    onAdd({
      name: values.name.trim(),
      category: values.category.trim(),
      price: Number(values.price),
      description: values.description.trim(),
      image: PLACEHOLDER_IMAGE,
    });
    setLastAdded(values.name.trim());
    form.reset();
  };

  return (
    <form noValidate onSubmit={form.handleSubmit(onValid)}>
      <div className="row g-3">
        <div className="col-md-6">
          <Field
            id="juego-nombre"
            label="Nombre del juego"
            name="name"
            type="text"
            maxLength={LIMITS.gameName.max}
            value={form.values.name}
            error={form.errorFor('name')}
            onChange={form.handleChange}
            onBlur={form.handleBlur}
          />
        </div>
        <div className="col-md-6">
          <Field
            id="juego-categoria"
            as="select"
            label="Categoría"
            name="category"
            value={form.values.category}
            error={form.errorFor('category')}
            onChange={form.handleChange}
            onBlur={form.handleBlur}
          >
            <option value="">Selecciona una categoría…</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </Field>
        </div>
        <div className="col-md-4">
          <Field
            id="juego-precio"
            label="Precio (CLP)"
            name="price"
            type="number"
            inputMode="numeric"
            min="1"
            step="1"
            value={form.values.price}
            error={form.errorFor('price')}
            onChange={form.handleChange}
            onBlur={form.handleBlur}
          />
        </div>
        <div className="col-md-8">
          <Field
            id="juego-descripcion"
            label="Descripción"
            name="description"
            type="text"
            maxLength={LIMITS.gameDescription.max}
            value={form.values.description}
            error={form.errorFor('description')}
            onChange={form.handleChange}
            onBlur={form.handleBlur}
          />
        </div>
      </div>
      <button type="submit" className="btn btn-accent">
        Agregar videojuego
      </button>
      <div role="status" aria-live="polite" className="mt-3">
        {lastAdded && <div className="alert alert-success mb-0">«{lastAdded}» se agregó al catálogo.</div>}
      </div>
    </form>
  );
}
