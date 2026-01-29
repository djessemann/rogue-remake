import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  // Use repo name for GitHub Pages, '/' for other hosts
  base: process.env.GITHUB_ACTIONS ? '/rogue-remake/' : '/',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'portal.html'),
        'rogues-gallery': resolve(__dirname, 'rogues-gallery/index.html'),
      },
    },
  },
});
