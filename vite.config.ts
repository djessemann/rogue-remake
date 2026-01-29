import { defineConfig } from 'vite';
import { resolve } from 'path';

// Determine theme and output configuration
const theme = process.env.VITE_THEME || 'classic';
const isRiftBuild = theme === 'rift';

// For rift theme builds, we build a single-page app to dimensional-drift/
// For classic/default builds, we build the portal + rogues-gallery
const getRollupInput = () => {
  if (isRiftBuild) {
    return {
      main: resolve(__dirname, 'dimensional-drift/index.html'),
    };
  }
  return {
    main: resolve(__dirname, 'portal.html'),
    'rogues-gallery': resolve(__dirname, 'rogues-gallery/index.html'),
  };
};

export default defineConfig({
  // Use repo name for GitHub Pages, '/' for other hosts
  // For rift builds, use dimensional-drift subdirectory as base
  base: process.env.GITHUB_ACTIONS
    ? (isRiftBuild ? '/rogue-remake/dimensional-drift/' : '/rogue-remake/')
    : (isRiftBuild ? '/dimensional-drift/' : '/'),
  build: {
    outDir: isRiftBuild ? 'dist-rift' : 'dist',
    rollupOptions: {
      input: getRollupInput(),
      output: isRiftBuild ? {
        // For rift build, put assets in the dimensional-drift subfolder
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
      } : undefined,
    },
  },
});
