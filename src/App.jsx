import { useMemo, useState } from 'react';
import Navbar from './components/Navbar.jsx';
import CategoryFilter from './components/CategoryFilter.jsx';
import GameList from './components/GameList.jsx';
import AddGameForm from './components/AddGameForm.jsx';
import ContactForm from './components/ContactForm.jsx';
import { useGames } from './hooks/useGames.js';
import { ALL_CATEGORIES, filterByCategory, getCategories } from './utils/games.js';

/** El catálogo se carga desde un archivo estático; podría reemplazarse por una API sin tocar los componentes. */
const CATALOG_URL = 'data/games.json';

const NAV_LINKS = [
  { href: '#inicio', label: 'Inicio' },
  { href: '#catalogo', label: 'Catálogo' },
  { href: '#administrar', label: 'Agregar juego' },
  { href: '#contacto', label: 'Contacto' },
  { href: 'vanilla/index.html', label: 'Versión JS puro' },
];

/**
 * Componente raíz. Concentra el estado compartido (catálogo y categoría activa) y lo reparte
 * a los hijos mediante props ("lifting state up").
 */
export default function App() {
  const { games, status, addGame, removeGame } = useGames(CATALOG_URL);
  const [selectedCategory, setSelectedCategory] = useState(ALL_CATEGORIES);

  const categories = useMemo(() => getCategories(games), [games]);
  // Si se elimina el último juego de la categoría activa, se vuelve a "Todas" sin necesidad de un efecto
  const activeCategory = categories.includes(selectedCategory) ? selectedCategory : ALL_CATEGORIES;
  const visibleGames = useMemo(() => filterByCategory(games, activeCategory), [games, activeCategory]);
  const realCategories = useMemo(() => categories.filter((c) => c !== ALL_CATEGORIES), [categories]);

  return (
    <>
      <a className="visually-hidden-focusable skip-link" href="#catalogo">
        Saltar al catálogo
      </a>
      <Navbar brand="PixelVault" links={NAV_LINKS} />

      <header id="inicio" className="hero text-center">
        <div className="container py-5">
          <h1 className="display-5 fw-bold">Tu próxima aventura empieza aquí</h1>
          <p className="lead mx-auto hero-lead">
            Descubre videojuegos de todos los géneros, filtra por categoría y encuentra el título perfecto
            para tu consola o PC.
          </p>
          <a className="btn btn-accent btn-lg" href="#catalogo">
            Ver catálogo
          </a>
        </div>
      </header>

      <main className="container py-5">
        <section id="catalogo" aria-labelledby="titulo-catalogo" className="mb-5">
          <h2 id="titulo-catalogo" className="mb-3">
            Catálogo
          </h2>
          <div className="mb-4">
            <CategoryFilter categories={categories} active={activeCategory} onSelect={setSelectedCategory} />
          </div>
          <GameList games={visibleGames} status={status} onRemove={removeGame} />
        </section>

        <section id="administrar" aria-labelledby="titulo-administrar" className="mb-5">
          <h2 id="titulo-administrar" className="mb-3">
            Agregar un videojuego
          </h2>
          <p className="text-body-secondary">
            Los cambios se guardan en el estado de la aplicación y se reinician al recargar la página.
          </p>
          <AddGameForm categories={realCategories} onAdd={addGame} />
        </section>

        <section id="contacto" aria-labelledby="titulo-contacto" className="mb-2">
          <h2 id="titulo-contacto" className="mb-3">
            Contacto
          </h2>
          <div className="row">
            <div className="col-lg-7">
              <ContactForm />
            </div>
          </div>
        </section>
      </main>

      <footer className="app-footer py-4">
        <div className="container d-flex flex-column flex-md-row justify-content-between gap-2">
          <p className="mb-0">© 2026 PixelVault. Proyecto académico — Desarrollo Frontend I.</p>
          <p className="mb-0">Las portadas son ilustraciones generadas para este proyecto.</p>
        </div>
      </footer>
    </>
  );
}
