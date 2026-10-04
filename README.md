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

The 3D model was compressed from the original export with
`npx @gltf-transform/cli optimize in.glb public/models/duaa.glb --compress meshopt --texture-compress webp --texture-size 2048 --simplify-ratio 0.15 --simplify-error 0.002`.
