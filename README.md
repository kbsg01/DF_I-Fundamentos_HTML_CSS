# PixelVault — Tienda online de videojuegos

Evaluación Final Transversal · **Desarrollo Frontend I (PFY2201)** · Duoc UC

Sitio web de una tienda de videojuegos construido con **HTML5, CSS3, Bootstrap 5, JavaScript y React 19**
(Vite como herramienta de build). Incluye dos implementaciones del mismo producto para evidenciar cada
parte de la rúbrica:

| Versión | Archivo de entrada | Qué demuestra |
| --- | --- | --- |
| **React** (principal) | `index.html` → `src/` | Componentes, `state`, `props`, hooks, carga desde JSON |
| **JavaScript puro** | `vanilla/index.html` → `vanilla/js/` | HTML semántico, objeto JS, manipulación del DOM, validación |

Ambas comparten estilos (`src/styles/app.css`) y lógica pura (`src/utils/`), de modo que la lógica de
negocio se escribe y se prueba una sola vez.

## Requerimientos cubiertos

- Página principal con productos en **tarjetas** (imagen, nombre, precio, descripción).
- **Barra de navegación** (Bootstrap) entre secciones: Inicio, Catálogo, Agregar juego, Contacto.
- **Filtro por categoría** (botones) que actualiza el listado y anuncia el resultado a lectores de pantalla.
- **Formulario de contacto** (nombre, email, mensaje) con validación previa al envío y mensajes de error.
- **Componentes React**: `Navbar`, `CategoryFilter`, `GameList`, `GameCard`, `AddGameForm`, `ContactForm`, `Field`.
- **Estado** para agregar y eliminar videojuegos; **props** para comunicar componentes.
- Diseño **responsivo** (Bootstrap + CSS Grid/Flexbox) y accesible (WCAG 2.1 AA: etiquetas, foco visible,
  regiones `aria-live`, contraste, `prefers-reduced-motion`).

## Requisitos previos

- [Node.js](https://nodejs.org/) **22.12 o superior** (ver `.nvmrc`; con `nvm use` se selecciona automáticamente).
- npm 10 o superior (incluido con Node).

## Instalación y uso

```bash
# 1. Instalar dependencias exactas (usa package-lock.json)
npm ci

# 2. Servidor de desarrollo con recarga en caliente → http://localhost:5173
npm run dev
#    · React:        http://localhost:5173/
#    · JS puro:      http://localhost:5173/vanilla/index.html

# 3. Verificación de calidad (lint + pruebas + build)
npm run check

# 4. Build de producción y vista previa → http://localhost:4173
npm run build
npm run preview
```

Otros comandos: `npm run lint`, `npm test` (Vitest), `npm run test:watch`, `npm run covers`
(regenera las portadas SVG desde `public/data/games.json`).

## Contenedor Docker

El contenedor compila el sitio y lo sirve con Nginx sin privilegios:

```bash
docker compose up --build
```

Abre `http://localhost:8080`. Para detenerlo, ejecuta `docker compose down`.

## Publicación en GitHub Pages

El workflow `.github/workflows/deploy.yml` ejecuta `npm run check` al hacer push a `main` y publica
`dist/` en la rama `gh-pages`. También puede iniciarse manualmente desde la pestaña **Actions**.
En **Settings → Pages**, selecciona **Deploy from a branch**, la rama `gh-pages` y la carpeta
`/(root)`. La publicación de GitHub Pages usa los archivos estáticos del build; no ejecuta el
contenedor Docker.

## Estructura del proyecto

```text
.
├── index.html                 # Entrada de la versión React
├── vanilla/
│   ├── index.html             # Entrada de la versión JS puro (HTML semántico + Bootstrap)
│   └── js/
│       ├── data.js            # Objeto JS con el catálogo (Paso 2)
│       ├── catalog.js         # Generación dinámica de tarjetas y filtro (DOM)
│       ├── contact.js         # Validación del formulario de contacto
│       └── main.js            # Punto de entrada
├── src/
│   ├── main.jsx · App.jsx     # Raíz de React y estado compartido
│   ├── components/            # Componentes de presentación reutilizables
│   ├── hooks/                 # useGames (carga/estado del catálogo) · useForm (formularios)
│   ├── utils/                 # Funciones puras: games.js, validation.js
│   ├── styles/app.css         # Estilos compartidos
│   └── test/                  # Configuración y pruebas transversales
├── public/
│   ├── data/games.json        # Catálogo cargado por React (equivalente a vanilla/js/data.js)
│   └── img/                   # Portadas SVG originales
└── scripts/                   # generate-covers.mjs · package.sh
```

## Decisiones técnicas y buenas prácticas

- **Separación de responsabilidades**: la validación y el filtrado son funciones puras (fáciles de probar);
  los componentes solo presentan datos y el estado vive en `App` ("lifting state up").
- **Seguridad frontend**: React escapa el contenido por defecto; la versión pura usa `textContent`
  (nunca `innerHTML`) para evitar XSS; los datos externos pasan por `sanitizeGames`; los campos tienen
  límites de longitud; Bootstrap se instala desde npm y se empaqueta localmente, por lo que **no hay
  recursos de terceros cargados desde CDN** (si se usara un CDN, cada `<script>`/`<link>` debe llevar
  `integrity` SRI y `crossorigin`). La validación en cliente no reemplaza la del servidor.
- **Cabeceras recomendadas al publicar** (se configuran en el servidor/hosting, no en el HTML):
  `Strict-Transport-Security`, `Content-Security-Policy` (`default-src 'self'`),
  `X-Content-Type-Options: nosniff` y `Referrer-Policy`.
- **Accesibilidad**: enlace de salto, etiquetas asociadas, `aria-invalid`/`aria-describedby`,
  `aria-pressed` en filtros, mensajes `role="status"`.
- **Rendimiento**: imágenes con `width`/`height` (evita saltos de layout) y `loading="lazy"`; SVG livianos.
- **Pruebas** (Vitest + Testing Library): utilidades, validaciones, filtrado, alta/baja de juegos, errores del
  formulario, generación del DOM y sincronía entre `data.js` y `games.json`.

## Compatibilidad verificada

Chromium (escritorio) a 375 px, 768 px y 1280 px sin desbordes horizontales ni errores de consola.
Se recomienda además revisar manualmente Firefox y Safari antes de la entrega.
Evidencias en `docs/evidencias/` (fuera de este repositorio, en la carpeta de entrega).

## Entrega

1. Repositorio GitHub compartido con el docente (este proyecto).
2. Video MP4 con el recorrido (guion en `docs/guion_video.md`).
3. Carpeta comprimida `nombre_Alumno_PFY2201_EFT_FRONT_END_I.zip`:

   ```bash
   ALUMNO=Nombre_Apellido npm run package
   ```

## Control de versiones

Flujo con ramas semánticas (`feat/`, `fix/`, `chore/`, `update/`) y *Conventional Commits*.
Nunca se trabaja sobre `main` y no se hace `push --force`.

## Licencia y créditos

Proyecto académico. Las portadas son ilustraciones generadas por `scripts/generate-covers.mjs`
y no reproducen obras ni marcas de terceros.
