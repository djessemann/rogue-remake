3 versions of the game live to play with.

**Netlify:** https://rogue-tribute.netlify.app/

**GitHub Pages:** https://djessemann.github.io/rogue-remake/

Both hosts serve the same site from `main`, with a portal at the root
linking to each version:

| | Netlify | GitHub Pages |
|---|---|---|
| Rogues Gallery | [/rogues-gallery/](https://rogue-tribute.netlify.app/rogues-gallery/) | [link](https://djessemann.github.io/rogue-remake/rogues-gallery/) |
| Rogue Tree | [/rogue-tree/](https://rogue-tribute.netlify.app/rogue-tree/) | [link](https://djessemann.github.io/rogue-remake/rogue-tree/) |
| Rogue Rift | [/dimensional-drift/](https://rogue-tribute.netlify.app/dimensional-drift/) | [link](https://djessemann.github.io/rogue-remake/dimensional-drift/) |

## Building

`npm run build:site` produces the full deployable site in `dist/`: it runs
the Vite build, renames `portal.html` to `index.html`, and copies the
pre-built `rogue-tree/` and `dimensional-drift/` directories in. Both
Netlify and the GitHub Pages workflow run this same command, so the two
deployments can't drift apart.
