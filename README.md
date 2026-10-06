# deeportfolio

Portfolio site for Duaa Alahmed, built with React, TypeScript, Vite, Tailwind CSS v4, [shadcn/ui](https://ui.shadcn.com) and a 3D hero model rendered with react-three-fiber.

## Getting started

Requires Node.js 20.19+ (or 22.12+).

```bash
npm install
npm run dev      # start the dev server at http://localhost:5173
npm run build    # type-check and build to dist/
npm run preview  # preview the production build
npm run lint     # lint with oxlint
```

## Project structure

- `src/components/sections/` holds the page sections (navbar, landing, about, projects, education, footer).
- `src/components/ui/` holds the shadcn components. Add more with `npx shadcn@latest add <name>`.
- `src/components/ModelViewer.tsx` renders `public/models/duaa.glb` in the hero. It is lazy-loaded so three.js stays out of the main bundle.
- `src/index.css` imports Tailwind and defines the shadcn theme variables and the portfolio colors (lavender, peech, yellow).

The 3D model is a single static mesh, so it is animated in the shader (`src/components/modelAnimation.ts`): the girl waves both hands and blinks, and the cat swings its tail. The moving parts are marked by per-vertex weights that `scripts/paint-model-weights.mjs` paints onto the original Meshy export, which is then compressed to about 2 MB. The script header has the exact commands.
