import { defineConfig } from 'vite';

export default defineConfig({
  // Use repo name for GitHub Pages, '/' for other hosts
  base: process.env.GITHUB_ACTIONS ? '/rogue-remake/' : '/',
});
