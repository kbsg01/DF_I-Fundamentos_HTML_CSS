import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // necesario para el menú colapsable (data-bs-toggle)
import '../../src/styles/app.css';
import { GAMES } from './data.js';
import { initCatalog } from './catalog.js';
import { initContactForm } from './contact.js';

initCatalog({
  games: GAMES,
  filtersEl: document.getElementById('filtros'),
  gridEl: document.getElementById('catalogo-grid'),
  statusEl: document.getElementById('resultado'),
});

initContactForm(document.getElementById('form-contacto'), document.getElementById('contacto-estado'));
