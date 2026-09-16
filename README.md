# BQBrand — Actividad Sumativa Semana 6

Desarrollo Frontend I (PFY2201) — Optimizando la lógica y rendimiento de una página web con JavaScript.

Página principal de un eCommerce construida con **Bootstrap 5** y **JavaScript**:

- Navbar responsiva con dos categorías simuladas (Tecnología / Hogar) y buscador.
- Catálogo de productos cargado dinámicamente con **Fetch API** desde `assets/js/products.json`.
- Carrito de compras interactivo (evento `click`) con resumen y total en tiempo real.
- Formulario de búsqueda (evento `submit`) que filtra el catálogo por nombre.
- Manejo de errores: si el JSON no se puede cargar, se muestra un aviso amigable en pantalla.

## Estructura

```text
index.html
assets/
  css/styles.css
  js/app.js
  js/products.json
  img/*.svg
```

## Cómo verlo localmente

El `fetch` de `products.json` requiere servir los archivos por HTTP (algunos
navegadores bloquean `fetch` sobre `file://`). Basta con:

```bash
python -m http.server 8000
```

y abrir `http://localhost:8000` en el navegador. También funciona directamente
al desplegarlo en GitHub Pages.
