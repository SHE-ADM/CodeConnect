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

## Frontend: Design tokens & styling (Tailwind v4)

Applies to both apps. Custom tokens live in `@theme` blocks — `apps/nextjs/app/globals.css` and `apps/web/src/index.css`. Never use inline `style={{}}` when a Tailwind class exists.

### Colors — extend the theme, never hardcode

Forbidden in components: `bg-[#81fe88]`, `text-[#e1e1e1]`, `border-[#00090e]` — any `[#xxxxxx]` in a class is a bug.

Extend the palette in `@theme` with a **two-layer pattern**:

1. **Raw palette** — token names mirror the Figma design system (e.g. `--color-verde-destaque`, `--color-cinza-escuro`). These are the source of truth.
2. **Semantic aliases** — role/surface names referencing the raw tokens (e.g. `--color-brand: var(--color-verde-destaque)`).

```css
@theme {
  /* Raw palette — Figma source of truth */
  --color-offwhite:       #e1e1e1;
  --color-verde-destaque: #81fe88;
  --color-verde-petroleo: #132e35;

  /* Semantic aliases — used by components */
  --color-ink:      var(--color-offwhite);
  --color-brand:    var(--color-verde-destaque);
  --color-on-brand: var(--color-verde-petroleo);
}
```

Both layers generate Tailwind utilities automatically (`bg-verde-destaque` AND `bg-brand`). Components MUST use the **semantic alias** (`bg-brand`, `text-ink`), never the raw name directly — that keeps Figma renames isolated to the CSS file.

### Sizes — use Tailwind tokens, not arbitrary pixels

Forbidden in components: `text-[15px]`, `gap-[12px]`, `p-[18px]`, `rounded-[20px]`, `w-[420px]` — any `[NNpx]` in a class is a bug.

Map every Figma pixel value to the closest Tailwind token:

| Figma size | Token | px |
|---|---|---|
| 12 / 12.5 | `text-xs` | 12 |
| 14 / 15 | `text-sm` | 14 |
| 16 | `text-base` | 16 |
| 18 | `text-lg` | 18 |
| 20 / 22 | `text-xl` | 20 |
| 24 / 26 | `text-2xl` | 24 |
| 30 / 31 | `text-3xl` | 30 |

When a Figma value sits exactly between two tokens (e.g. 22px between `text-xl` 20px and `text-2xl` 24px), pick the **smaller** one — staying conservative reads better and avoids visual creep.

Same rule for the spacing scale (`gap-*`, `p-*`, `m-*`, `w-*`, `h-*`): prefer the 4px-step Tailwind scale (`gap-2` = 8px, `gap-4` = 16px) over arbitrary `[12px]`.

### Radius and shadows

Define semantic radius tokens in `@theme`: `--radius-card`, `--radius-field`, `--radius-button`. Components use semantic utilities (`rounded-card`, `rounded-field`, `rounded-button`) — never arbitrary `rounded-[NNpx]`.

### Extending the scale when no token fits

If a design value sits clearly outside the closest Tailwind token (e.g. a 420px decorative element with no acceptable equivalent in the default spacing scale), **extend the theme** rather than dropping to an arbitrary value:

```css
@theme {
  --spacing-decoration-lg: 26rem;  /* 416px */
}
```

This generates `w-decoration-lg`, `h-decoration-lg`, etc. Same rule as colors: tokens in `@theme`, never `[NNpx]` in a class — not even for decorative ornaments.

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
