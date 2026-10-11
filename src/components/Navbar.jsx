import { useState } from 'react';

/**
 * Barra de navegación (componente de Bootstrap 5 controlado con estado de React).
 * El colapso en móvil se maneja con `useState` en lugar del JS de Bootstrap, para no
 * mezclar dos librerías manipulando el mismo DOM.
 *
 * @param {object} props
 * @param {string} props.brand nombre de la tienda
 * @param {{ href: string, label: string }[]} props.links enlaces de navegación
 */
export default function Navbar({ brand, links }) {
  const [open, setOpen] = useState(false);

  return (
    <nav className="navbar navbar-expand-lg sticky-top app-navbar" aria-label="Navegación principal">
      <div className="container">
        <a className="navbar-brand fw-bold" href="#inicio">
          <span aria-hidden="true">🎮 </span>
          {brand}
        </a>
        <button
          className="navbar-toggler"
          type="button"
          aria-controls="menu-principal"
          aria-expanded={open}
          aria-label="Mostrar u ocultar el menú"
          onClick={() => setOpen((prev) => !prev)}
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div id="menu-principal" className={`collapse navbar-collapse${open ? ' show' : ''}`}>
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            {links.map((link) => (
              <li className="nav-item" key={link.href}>
                <a className="nav-link" href={link.href} onClick={() => setOpen(false)}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}
