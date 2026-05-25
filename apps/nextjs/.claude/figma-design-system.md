# Figma Design System Rules — CodeConnect `apps/nextjs`
# Scope: apps/nextjs only (Next.js 16 + React 19 + Tailwind CSS v4)
# Last updated: 2026-05-22

---

## CRITICAL — READ BEFORE ANY CODE

`apps/nextjs` runs **Next.js 16**, which has breaking changes from v14/v15.
Before writing any code, read the relevant guide in `node_modules/next/dist/docs/`.
Do not rely on training-data knowledge of Next.js — APIs and conventions may differ.

---

## STACK OVERVIEW

| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js — App Router | 16.x |
| UI | React | 19.x |
| Styling | Tailwind CSS v4 (CSS-first, PostCSS plugin) | 4.x |
| Language | TypeScript (strict, `isolatedModules`) | 5.x |
| Build | Next.js built-in (webpack/turbopack) | — |
| Linting | ESLint 9 — flat config, `eslint-config-next` core-web-vitals + typescript | 9.x |
| Testing | Vitest + @testing-library/react (required, not yet installed) | — |
| Icons | SVG files in `public/` or inline SVG (no icon library) | — |
| Fonts | Geist Sans + Geist Mono via `next/font/google` | — |
| Path alias | `@/*` → project root (`./`) | — |

---

## 1. DESIGN TOKENS

### Location

All design tokens are defined in:

```
apps/nextjs/app/globals.css
```

### Current Token Definitions (scaffold — minimal)

```css
/* apps/nextjs/app/globals.css */
@import "tailwindcss";

:root {
  --background: #ffffff;
  --foreground: #171717;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}

@media (prefers-color-scheme: dark) {
  :root {
    --background: #0a0a0a;
    --foreground: #ededed;
  }
}
```

**This is scaffold state.** When implementing a Figma design, add all new tokens here.

### Token Architecture — Tailwind CSS v4 CSS-first

No `tailwind.config.ts` exists — forbidden in v4. All tokens go in `@theme` blocks in `globals.css`.

**Two-layer pattern in use:**

1. **CSS custom properties on `:root`** — mode-aware (light/dark via media query):
   ```css
   :root { --background: #fff; }
   @media (prefers-color-scheme: dark) { :root { --background: #0a0a0a; } }
   ```

2. **`@theme inline` block** — bridges CSS vars to Tailwind utility generation:
   ```css
   @theme inline {
     --color-background: var(--background);  /* generates bg-background, text-background */
     --font-sans: var(--font-geist-sans);    /* generates font-sans */
   }
   ```

**Rule:** Never add raw hex values inside `@theme inline`. Put the hex in `:root` /
dark-mode block first, then reference the var inside `@theme inline`.

### Adding New Tokens (pattern to follow)

```css
/* 1. Declare raw values in :root */
:root {
  --brand: #6366f1;
  --brand-foreground: #ffffff;
  --surface-card: #f8fafc;
}

@media (prefers-color-scheme: dark) {
  :root {
    --brand: #818cf8;
    --surface-card: #1e293b;
  }
}

/* 2. Expose to Tailwind inside @theme inline */
@theme inline {
  --color-brand:            var(--brand);
  --color-brand-foreground: var(--brand-foreground);
  --color-surface-card:     var(--surface-card);
}
```

Generated Tailwind classes: `bg-brand`, `text-brand`, `bg-surface-card`, etc.

---

## 2. TYPOGRAPHY

### Font Loading

Fonts are loaded in `app/layout.tsx` via `next/font/google` — **not** `<link>` tags.
They are exposed as CSS variables injected on `<html>`:

```tsx
// apps/nextjs/app/layout.tsx
import { Geist, Geist_Mono } from 'next/font/google';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

// Applied to <html> as className:
// className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
```

These variables are then picked up by `@theme inline`:

```css
@theme inline {
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}
```

Usage in components: `className="font-sans"` or `className="font-mono"`.

**Rule:** To add a new font from Google Fonts, import it in `layout.tsx` as a variable,
then reference the variable in `globals.css` `@theme inline`.

---

## 3. COMPONENT LIBRARY

### Architecture: Atomic Design (defined in `CLAUDE.md`)

```
apps/nextjs/components/          ← does not exist yet; create as needed
├── atoms/      # Primitives — no business logic, no deps on other components
├── molecules/  # Composed from atoms — local state OK, no API calls
├── organisms/  # Complex sections — can read context/hooks, no direct API calls
└── templates/  # Layout shells — structure only, content via props/children
```

**Data ownership — strictly enforced:**

| Layer | May fetch data? | May call API directly? |
|---|---|---|
| `app/**` (routes) | Yes — Server Components or `useEffect` | Yes |
| `organisms/` | No — receives via props/context | No |
| `molecules/` | No | No |
| `atoms/` | No | No |
| `templates/` | No | No |

### Path Alias

`@/*` resolves to the app root (`.`), not `src/`:

```tsx
import { Button } from '@/components/atoms/Button';   // ✅
import { metadata } from '@/app/layout';              // ✅ — root, not src/
```

### Component Testing — Mandatory

Every component file **must** have a co-located test file:

```
components/atoms/Button.tsx
components/atoms/Button.test.tsx   ← required
```

Minimum test coverage per component:
1. Renders without crashing with required props.
2. Its essential interaction (click fires handler, input updates, link has correct `href`).

Test stack: **Vitest + @testing-library/react** (not yet installed in scaffold).

---

## 4. STYLING APPROACH

### CSS Methodology

- **Tailwind CSS v4 utility classes** — no CSS Modules, no Styled Components, no CSS-in-JS.
- PostCSS plugin: `@tailwindcss/postcss` (configured in `postcss.config.mjs`).
- No utility lib (`cn`/`clsx`) installed yet — use template literal concatenation or install
  `clsx` + `tailwind-merge` when conditional class merging complexity warrants it.

### Dark Mode

Implemented via CSS media query, **not** Tailwind's `dark:` variant:

```css
@media (prefers-color-scheme: dark) {
  :root { --background: #0a0a0a; --foreground: #ededed; }
}
```

When Figma provides a dark variant: add the dark values to the media query block in `:root`,
not as `dark:` class variants on individual elements.

### Inline Style Prohibition

Never use `style={{}}` when a Tailwind class exists. Only acceptable for dynamic values
that cannot be expressed as static classes (e.g., computed widths from JS).

### Responsive Design

Tailwind's standard responsive prefixes: `sm:`, `md:`, `lg:`, `xl:`, `2xl:`.
Current page uses `sm:` for layout shifts (e.g., `sm:items-start`, `sm:flex-row`).

---

## 5. ASSET MANAGEMENT

### Static SVG Icons

All SVGs currently reside in `public/`:

| File | Content |
|---|---|
| `public/next.svg` | Next.js wordmark |
| `public/vercel.svg` | Vercel logomark |
| `public/globe.svg` | Globe icon |
| `public/window.svg` | Window icon |
| `public/file.svg` | File icon |

Referenced in components via `next/image`:

```tsx
import Image from 'next/image';
<Image src="/next.svg" alt="Next.js logo" width={100} height={20} priority />
```

### next/image Rules

- Always use `next/image` instead of `<img>` for all raster images.
- Provide explicit `width` and `height` to avoid layout shift.
- Use `priority` on above-the-fold images (LCP candidates).
- Use `loading="lazy"` (default) for below-the-fold images.
- SVGs used decoratively: `alt=""` + `aria-hidden="true"`.

### Asset Locations

| Asset type | Location | Import method |
|---|---|---|
| SVG icons | `public/*.svg` | `next/image` or inline SVG |
| Raster images | `public/*.{png,jpg,webp}` | `next/image` |
| Fonts | Via `next/font/google` | CSS variable on `<html>` |

---

## 6. ICON SYSTEM

No icon library is installed. Icons are either:

1. **SVG files in `public/`** — used via `next/image` (renders as `<img>`)
2. **Inline SVG** — for icons that need `currentColor` theming or complex interactions

For new icons from Figma:
- Export as SVG from Figma.
- Place in `public/` if used as an `<img>`.
- Inline as a component in `components/atoms/icons/` if color-themeable or interactive.

**Inline SVG convention:**

```tsx
// components/atoms/icons/ChevronRightIcon.tsx
export function ChevronRightIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
      <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5"
            strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
```

---

## 7. APP ROUTER STRUCTURE

```
apps/nextjs/
├── app/
│   ├── layout.tsx         # Root layout — fonts, metadata, <html>/<body>
│   ├── globals.css        # @theme tokens + global body styles
│   ├── page.tsx           # Home route (/)
│   └── favicon.ico
│
├── components/            # Does not exist yet — create as needed
│   ├── atoms/
│   ├── molecules/
│   ├── organisms/
│   └── templates/
│
├── public/                # Static assets — served at root
│   ├── next.svg
│   ├── vercel.svg
│   ├── globe.svg
│   ├── window.svg
│   └── file.svg
│
├── next.config.ts         # Next.js config (empty scaffold)
├── postcss.config.mjs     # @tailwindcss/postcss plugin
├── eslint.config.mjs      # Flat config — core-web-vitals + typescript
├── tsconfig.json          # strict + isolatedModules + @/* alias to root
└── package.json
```

---

## 8. FIGMA → CODE WORKFLOW (this app)

### Step-by-step

1. Call `get_design_context` + `get_screenshot` with the Figma file/node.
2. Identify the Atomic level: atom / molecule / organism / template / page.
3. Check `components/` for an existing component before creating a new one.
4. Map Figma fill colors to `:root` CSS vars → `@theme inline` → Tailwind classes.
   - If the token does not exist yet, add it to `globals.css` following the two-layer pattern.
5. Map Figma fonts: check if Geist Sans/Mono covers it. If not, add via `next/font/google`.
6. Use `next/image` for all raster images from Figma assets.
7. Export SVG icons from Figma → inline component or `public/` depending on theming needs.
8. Write a co-located `.test.tsx` for every new component file.
9. Verify visually against the Figma screenshot before marking complete.

### TypeScript Constraints

- `strict: true` — all props typed.
- `isolatedModules: true` — each file must be a module; `import type` for type-only imports.
- `resolveJsonModule: true` — JSON imports allowed.
- No `erasableSyntaxOnly` (unlike `apps/web`) — standard TypeScript features are allowed.

---

## 9. REST API CONVENTIONS (from `CLAUDE.md`)

API routes live under `app/api/v1/` as Next.js Route Handlers.

### URL pattern

```
GET    /api/v1/posts        # list
GET    /api/v1/posts/:id    # get one
POST   /api/v1/posts        # create
PATCH  /api/v1/posts/:id    # update
DELETE /api/v1/posts/:id    # delete
```

### Response envelope

```json
{ "data": ..., "error": null, "meta": { "page": 1, "total": 42 } }
```

On error: `{ "data": null, "error": { "code": "VALIDATION_ERROR", "message": "..." } }`

### HTTP status codes

| Situation | Code |
|---|---|
| Success | 200 |
| Created | 201 |
| No content | 204 |
| Validation error | 422 |
| Unauthorized | 401 |
| Forbidden | 403 |
| Not found | 404 |
| Conflict | 409 |
| Server error | 500 |

Validate request bodies with **Zod** before any business logic.

---

## 10. KEY DIFFERENCES FROM `apps/web`

| Aspect | `apps/web` (Vite+React) | `apps/nextjs` (Next.js 16) |
|---|---|---|
| Rendering | CSR only | SSR + SSG + Server Components |
| Router | None yet | App Router (`app/`) |
| Image component | `<img>` | `next/image` |
| Font loading | `<link>` in `index.html` | `next/font/google` in `layout.tsx` |
| Path alias `@/` | → `src/` | → project root (`./`) |
| TypeScript | `erasableSyntaxOnly` — enums forbidden | Standard TS 5 — enums allowed |
| Dark mode | Not implemented | `prefers-color-scheme` media query |
| Testing | Not yet required | Co-located `.test.tsx` mandatory |
| Token `@theme` style | `@theme { }` (direct) | `@theme inline { }` (via CSS vars) |
| CSS tool | `@tailwindcss/vite` plugin | `@tailwindcss/postcss` plugin |
