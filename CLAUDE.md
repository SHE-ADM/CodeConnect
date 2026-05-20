# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Monorepo structure

pnpm workspace with two apps under `apps/`:

| App | Stack | Purpose |
|---|---|---|
| `apps/nextjs` | Next.js 16 + React 19 + Tailwind CSS 4 + TypeScript 5 | Main web application |
| `apps/web` | Vite 8 + TypeScript 6 (vanilla — no framework) | Companion vanilla TS app |

Requires Node ≥20 and pnpm ≥11.

## Commands

### From the monorepo root

```bash
pnpm dev              # run both apps in parallel
pnpm dev:next         # run apps/nextjs only
pnpm dev:web          # run apps/web only
pnpm build:next       # build apps/nextjs
pnpm build:web        # build apps/web
pnpm lint:next        # lint apps/nextjs
pnpm lint:web         # lint apps/web
```

### From within each app

```bash
# apps/nextjs
pnpm dev    # next dev
pnpm build  # next build
pnpm start  # next start (after build)
pnpm lint   # eslint

# apps/web
pnpm dev      # vite
pnpm build    # tsc && vite build
pnpm preview  # vite preview (after build)
```

There are no test scripts configured in either app yet. When added, the command will be `pnpm test` inside each app, or `pnpm --filter <app> test` from the root.

## Critical version notes

### Next.js 16 — breaking changes

**This is Next.js 16, which has breaking changes from v14/v15.** APIs, conventions, and file structure may differ from training data. Before writing any code for `apps/nextjs`, read the relevant guide in `node_modules/next/dist/docs/`. Heed deprecation notices.

### Tailwind CSS v4 — CSS-first configuration

Tailwind v4 no longer uses `tailwind.config.ts`. All configuration lives in CSS:

```css
/* globals.css */
@import "tailwindcss";

@theme inline {
  --color-background: var(--background);
  --font-sans: var(--font-geist-sans);
  /* custom tokens go here */
}
```

PostCSS plugin is `@tailwindcss/postcss`, not the old `tailwindcss` plugin.

### TypeScript 6 in `apps/web`

`tsconfig.json` enables `erasableSyntaxOnly` — TypeScript features that require emit-time transformation (decorators, `const enum`, `namespace`) are not allowed. Use only syntax that can be statically erased.

## apps/nextjs architecture

- **App Router** — all routes live under `app/`. No `pages/` directory.
- **Path alias** — `@/*` resolves to the app root (e.g., `@/app/globals.css`).
- **Fonts** — loaded via `next/font/google` in `app/layout.tsx`, exposed as CSS variables `--font-geist-sans` / `--font-geist-mono`, consumed via `@theme inline` in `globals.css`.
- **Styling** — Tailwind v4 via `@import "tailwindcss"` in `app/globals.css`; custom tokens defined in `@theme` blocks.
- **ESLint** — uses `eslint-config-next` (core-web-vitals + typescript presets), flat config format (`eslint.config.mjs`).

## Git strategy

Applies to all apps in this monorepo.

**Branch model:**
```
main       ← production — never commit here directly
  └── Features  ← all work lands here; merged to main via PR only
```

**Conventional commits — mandatory format:**
```
type(scope): message
```

| Type | When to use |
|---|---|
| `feat` | New feature |
| `fix` | Bug fix |
| `refactor` | Code change with no behavior change |
| `test` | Adding or updating tests |
| `chore` | Build, deps, config — no production code |
| `docs` | Documentation only |
| `style` | Formatting, whitespace — no logic change |

Scope is the app or area affected: `nextjs`, `web`, `api`, `auth`, etc.

Examples: `feat(nextjs): add PostCard organism`, `fix(api): return 422 on missing title field`

**Never commit directly to `main`.** All commits go to `Features`.

## apps/web architecture

- Vanilla TypeScript — no framework, DOM manipulation via `document.querySelector`.
- Entry point: `src/main.ts`. Counter logic extracted to `src/counter.ts`.
- Static assets (`src/assets/`) imported directly by Vite and inlined or hashed at build time.
- No path aliases configured.
