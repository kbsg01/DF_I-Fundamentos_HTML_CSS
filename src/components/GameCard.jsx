import { formatPrice } from '../utils/games.js';

/**
 * Tarjeta de un videojuego (componente "card" de Bootstrap 5).
 * React escapa el texto automáticamente, por lo que no hay riesgo de XSS al mostrar
 * nombre o descripción ingresados por el usuario.
 *
 * @param {object} props
 * @param {import('../utils/games.js').Game} props.game datos del videojuego
 * @param {(id: number) => void} [props.onRemove] si se entrega, muestra el botón "Eliminar"
 */
export default function GameCard({ game, onRemove }) {
  return (
    <article className="card h-100 game-card">
      <img
        src={game.image}
        className="card-img-top"
        alt={`Portada de ${game.name}`}
        width="600"
        height="400"
        loading="lazy"
      />
      <div className="card-body d-flex flex-column">
        <span className="badge text-bg-secondary align-self-start mb-2">{game.category}</span>
        <h3 className="card-title h5">{game.name}</h3>
        <p className="card-text flex-grow-1">{game.description}</p>
        <div className="d-flex justify-content-between align-items-center mt-2">
          <strong className="game-price">{formatPrice(game.price)}</strong>
          {onRemove && (
            <button
              type="button"
              className="btn btn-sm btn-outline-danger"
              onClick={() => onRemove(game.id)}
              aria-label={`Eliminar ${game.name} del catálogo`}
            >
              Eliminar
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
