import { resolve } from 'node:path';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// Dos páginas de entrada:
//  - index.html         -> aplicación final en React (Paso 3)
//  - vanilla/index.html -> versión con JavaScript puro (Paso 2), útil para comparar enfoques
export default defineConfig({
  plugins: [react()],
  // Rutas relativas: el build funciona en cualquier subcarpeta (GitHub Pages, S3, etc.)
  base: './',
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        vanilla: resolve(import.meta.dirname, 'vanilla/index.html'),
      },
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.js'],
    css: false,
    include: ['src/**/*.test.{js,jsx}', 'vanilla/**/*.test.js'],
  },
});
