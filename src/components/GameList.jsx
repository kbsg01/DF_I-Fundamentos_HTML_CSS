import GameCard from './GameCard.jsx';

/**
 * Lista de videojuegos. Solo presenta datos: el filtrado y el estado viven en <App />.
 * Cubre los tres estados de una carga remota: cargando, error y listo (con o sin resultados).
 *
 * @param {object} props
 * @param {import('../utils/games.js').Game[]} props.games juegos ya filtrados
 * @param {'loading'|'ready'|'error'} props.status estado de la carga
 * @param {(id: number) => void} props.onRemove callback para eliminar un juego
 */
export default function GameList({ games, status, onRemove }) {
  if (status === 'loading') {
    return (
      <div className="text-center py-5" role="status">
        <div className="spinner-border" aria-hidden="true" />
        <p className="mt-3 mb-0">Cargando catálogo…</p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="alert alert-danger" role="alert">
        No fue posible cargar el catálogo. Revisa tu conexión e inténtalo nuevamente.
      </div>
    );
  }

  return (
    <>
      {/* Región "polite": los lectores de pantalla anuncian el resultado de cada filtro */}
      <p className="text-body-secondary" role="status" aria-live="polite">
        {games.length === 1 ? '1 videojuego encontrado' : `${games.length} videojuegos encontrados`}
      </p>
      {games.length === 0 ? (
        <p className="alert alert-info">No hay videojuegos en esta categoría.</p>
      ) : (
        <div className="catalog-grid">
          {games.map((game) => (
            <GameCard key={game.id} game={game} onRemove={onRemove} />
          ))}
        </div>
      )}
    </>
  );
}
