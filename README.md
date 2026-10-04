# deeportfolio

Portfolio frontend built with React, TypeScript, Vite and Tailwind CSS v4.

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

- `src/App.tsx` is the starter page.
- `src/index.css` imports Tailwind (`@import "tailwindcss";`).
- `vite.config.ts` registers the `@tailwindcss/vite` plugin.
