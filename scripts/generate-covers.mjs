/**
 * Genera portadas SVG originales (sin derechos de terceros) a partir de public/data/games.json.
 * Uso: npm run covers
 *
 * Cada portada usa un degradado y formas geométricas derivadas del id del juego,
 * de modo que el resultado es reproducible y liviano (< 3 KB por imagen).
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const games = JSON.parse(readFileSync(join(root, 'public/data/games.json'), 'utf8'));
mkdirSync(join(root, 'public/img'), { recursive: true });

const W = 600;
const H = 400;

/** Escapa texto para incrustarlo de forma segura en XML. */
const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

/** Generador pseudoaleatorio determinista (mulberry32) para formas reproducibles. */
function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a += 0x6d2b79f5;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

for (const game of games) {
  const rand = rng(game.id * 7919);
  const hue = Math.floor(rand() * 360);
  const c1 = `hsl(${hue} 70% 22%)`;
  const c2 = `hsl(${(hue + 55) % 360} 75% 45%)`;
  const accent = `hsl(${(hue + 180) % 360} 85% 65%)`;

  let shapes = '';
  for (let i = 0; i < 9; i += 1) {
    const x = Math.floor(rand() * W);
    const y = Math.floor(rand() * H);
    const r = 20 + Math.floor(rand() * 90);
    const opacity = (0.08 + rand() * 0.22).toFixed(2);
    shapes +=
      i % 3 === 0
        ? `<circle cx="${x}" cy="${y}" r="${r}" fill="${accent}" opacity="${opacity}"/>`
        : i % 3 === 1
          ? `<rect x="${x}" y="${y}" width="${r * 1.4}" height="${r}" rx="12" fill="#fff" opacity="${opacity}" transform="rotate(${Math.floor(rand() * 60)} ${x} ${y})"/>`
          : `<polygon points="${x},${y} ${x + r},${y + r / 2} ${x + r / 3},${y + r}" fill="${accent}" opacity="${opacity}"/>`;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Portada de ${esc(game.name)}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${c1}"/>
      <stop offset="1" stop-color="${c2}"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#g)"/>
  ${shapes}
  <rect x="0" y="${H - 120}" width="${W}" height="120" fill="#000" opacity="0.45"/>
  <text x="32" y="${H - 66}" font-family="Arial, Helvetica, sans-serif" font-size="38" font-weight="700" fill="#fff">${esc(game.name)}</text>
  <text x="32" y="${H - 28}" font-family="Arial, Helvetica, sans-serif" font-size="20" fill="${accent}">${esc(game.category.toUpperCase())}</text>
</svg>
`;
  writeFileSync(join(root, 'public', game.image), svg);
}

console.log(`Portadas generadas: ${games.length}`);
