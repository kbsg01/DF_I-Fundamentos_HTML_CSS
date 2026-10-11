import { useCallback, useEffect, useState } from 'react';
import { nextId, sanitizeGames } from '../utils/games.js';

/**
 * Hook que gestiona el estado del catálogo:
 *  - carga los videojuegos desde un archivo JSON (o API) al montar el componente,
 *  - expone operaciones para agregar y eliminar juegos.
 *
 * @param {string} url ubicación del JSON con el catálogo
 * @returns {{
 *   games: import('../utils/games.js').Game[],
 *   status: 'loading' | 'ready' | 'error',
 *   addGame: (game: Omit<import('../utils/games.js').Game, 'id'>) => void,
 *   removeGame: (id: number) => void
 * }}
 */
export function useGames(url) {
  const [games, setGames] = useState([]);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    // AbortController evita actualizar el estado si el componente se desmonta durante la carga
    const controller = new AbortController();

    fetch(url, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
      })
      .then((data) => {
        setGames(sanitizeGames(data));
        setStatus('ready');
      })
      .catch((error) => {
        if (error.name !== 'AbortError') setStatus('error');
      });

    return () => controller.abort();
  }, [url]);

  // Actualizaciones funcionales: siempre parten del estado más reciente
  const addGame = useCallback((game) => {
    setGames((prev) => [{ ...game, id: nextId(prev) }, ...prev]);
  }, []);

  const removeGame = useCallback((id) => {
    setGames((prev) => prev.filter((g) => g.id !== id));
  }, []);

  return { games, status, addGame, removeGame };
}
