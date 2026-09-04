# Kursportalen Frontend

## Getting started

### 1. Install pnpm

We use [pnpm](https://pnpm.io/) instead of npm/yarn because it's faster and saves disk space. If you don't have it yet, install it globally with:

```bash
npm install -g pnpm
```

Or check the [official installation guide](https://pnpm.io/installation) for other methods (Corepack, standalone script, etc.).

### 2. Install dependencies

From the project root, run:

```bash
pnpm install
```

### 3. Run the project

```bash
pnpm run dev
```

This starts the Vite dev server. It'll print a local URL (usually `http://localhost:5173`) that you can open in your browser. The page will hot-reload as you edit files.

## Main libraries we use

Below are the main libraries in this project. This isn't a full list of every dependency, just the important ones you'll actually be writing code with.

| Library                                             | What it's for                                                  | Docs                                                                                  |
| --------------------------------------------------- | -------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| [React Router](https://reactrouter.com/)            | Our routing solution, using the declarative variant            | [Docs](https://reactrouter.com/start/modes#declarative)                               |
| [Zustand](https://zustand-demo.pmnd.rs/)            | Global state management                                        | [Docs](https://zustand.docs.pmnd.rs/learn)                                            |
| [TanStack Query](https://tanstack.com/query/latest) | Data fetching + caching                                        | [Docs](https://tanstack.com/query/latest/docs/framework/react/overview)               |
| [Axios](https://axios-http.com/)                    | Making HTTP requests                                           | [Docs](https://axios.rest/pages/getting-started/examples/typescript.html)             |
| [shadcn/ui](https://ui.shadcn.com/)                 | Our UI components (buttons, inputs, cards, etc.)               | [Docs](https://ui.shadcn.com/docs) · [Theme editor](https://tweakcn.com/editor/theme) |
| [dayjs](https://day.js.org/)                        | Minimal library for parsing, formatting and manipulating dates | [Docs](https://day.js.org/docs/en/display/format)                                     |
| [Zod](https://zod.dev/)                             | TypeScript-first schema/validation library                     | [Docs](https://zod.dev/)                                                              |
| [React Hook Form](https://react-hook-form.com/)     | Handling forms with way less boilerplate                       | [Docs](https://react-hook-form.com/)                                                  |

If you're unsure how to use one of these, check the docs link first, most of them have great examples. Otherwise, ask in the group chat.

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is enabled on this template. See [this documentation](https://react.dev/learn/react-compiler) for more information.

Note: This will impact Vite dev & build performances.
You can also try [the experimental native React Compiler support in plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md#rust-react-compiler) by using `compiler: true` in the plugin options instead of using the Babel plugin.

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

You can also install [eslint-plugin-react-x](https://npmx.dev/package/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://npmx.dev/package/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x';
import reactDom from 'eslint-plugin-react-dom';

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```
