/**
 * Botones de filtro por categoría. Es un componente "controlado": no guarda estado propio,
 * recibe la categoría activa y avisa al padre mediante `onSelect` (flujo de datos unidireccional).
 *
 * @param {object} props
 * @param {string[]} props.categories categorías disponibles (incluye "Todas")
 * @param {string} props.active categoría seleccionada
 * @param {(category: string) => void} props.onSelect callback al elegir una categoría
 */
export default function CategoryFilter({ categories, active, onSelect }) {
  return (
    <div className="d-flex flex-wrap gap-2" role="group" aria-label="Filtrar videojuegos por categoría">
      {categories.map((category) => {
        const isActive = category === active;
        return (
          <button
            key={category}
            type="button"
            className={`btn btn-sm ${isActive ? 'btn-accent' : 'btn-outline-light'}`}
            aria-pressed={isActive}
            onClick={() => onSelect(category)}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}
