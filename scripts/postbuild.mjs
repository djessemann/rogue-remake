// Shared post-build step for every host we deploy to (Netlify, GitHub Pages).
// Vite emits the portal as portal.html; the site needs it as the root index,
// alongside the pre-built game directories that live outside the Vite build.
import { cp, rename, access } from 'node:fs/promises';
import { resolve } from 'node:path';

const dist = resolve(import.meta.dirname, '..', 'dist');
const root = resolve(import.meta.dirname, '..');
const games = ['dimensional-drift', 'rogue-tree'];

await rename(resolve(dist, 'portal.html'), resolve(dist, 'index.html'));

for (const game of games) {
  const src = resolve(root, game);
  try {
    await access(src);
  } catch {
    console.warn(`postbuild: skipping ${game} (not present)`);
    continue;
  }
  await cp(src, resolve(dist, game), { recursive: true });
}

console.log('postbuild: dist ready');
