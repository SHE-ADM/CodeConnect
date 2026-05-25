# Figma Design System Rules — CodeConnect `apps/web`
# Scope: apps/web only (Vite + React 19 + Tailwind CSS v4)
# Last updated: 2026-05-22

---

## STACK OVERVIEW

| Layer | Technology | Version |
|---|---|---|
| Framework | React (with JSX transform) | 19.x |
| Build tool | Vite | 8.x |
| Styling | Tailwind CSS v4 (CSS-first config) | 4.3+ |
| Language | TypeScript (strict, `erasableSyntaxOnly`) | 6.x |
| Icons | Inline SVG only (no icon library) | — |
| Fonts | Inter via Google Fonts CDN | 500, 600 |
| Path alias | `@/` → `src/` | — |

---

## 1. DESIGN TOKENS

### Location

All design tokens are defined as CSS custom properties inside a single `@theme` block in:

```
apps/web/src/index.css
```

### Token Format — Tailwind CSS v4 CSS-first

Tailwind v4 **has no `tailwind.config.ts`**. All tokens are declared in CSS using `@theme { ... }`.
Custom property names use the `--color-*`, `--font-*`, `--radius-*`, `--shadow-*` prefixes so
Tailwind automatically generates utility classes.

```css
/* apps/web/src/index.css */
@import "tailwindcss";

@theme {
  /* === SURFACES === */
  --color-page:    #0b0d10;   /* page background */
  --color-card:    #1a1d23;   /* card background */
  --color-field:   #262a31;   /* input / button-ghost background */
  --color-edge:    #3a3f47;   /* borders, dividers */
  --color-chain:   #1f2329;   /* decorative chain SVG color */

  /* === TEXT === */
  --color-ink:       #e5e7eb; /* primary text */
  --color-ink-muted: #9ca3af; /* secondary / placeholder text */
  --color-on-brand:  #0b0d10; /* text on brand-colored backgrounds */

  /* === BRAND === */
  --color-brand:       #a6f163; /* primary accent — lime green */
  --color-brand-hover: #94e055; /* hover state of brand */

  /* === TYPOGRAPHY === */
  --font-sans: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;

  /* === BORDER RADIUS === */
  --radius-card:  20px; /* modal / card corners */
  --radius-field:  8px; /* inputs, buttons, small elements */

  /* === SHADOWS === */
  --shadow-card: 0 10px 40px -10px rgba(0, 0, 0, 0.6); /* card elevation */
}
```

### Tailwind Utility Mapping

| CSS Custom Property | Generated Tailwind Class |
|---|---|
| `--color-page` | `bg-page`, `text-page` |
| `--color-card` | `bg-card`, `text-card` |
| `--color-field` | `bg-field` |
| `--color-edge` | `bg-edge`, `border-edge` |
| `--color-chain` | `text-chain` |
| `--color-ink` | `text-ink` |
| `--color-ink-muted` | `text-ink-muted` |
| `--color-on-brand` | `text-on-brand` |
| `--color-brand` | `bg-brand`, `text-brand`, `border-brand` |
| `--color-brand-hover` | `bg-brand-hover`, `hover:bg-brand-hover` |
| `--font-sans` | `font-sans` |
| `--radius-card` | `rounded-card` |
| `--radius-field` | `rounded-field` |
| `--shadow-card` | `shadow-card` |

**Rule:** Never hardcode hex values in components. Always use the semantic token utility classes above.

---

## 2. COMPONENT LIBRARY

### Architecture: Atomic Design

```
apps/web/src/components/
├── atoms/            # Primitive, single-responsibility UI elements
│   ├── Button.tsx
│   ├── Checkbox.tsx
│   ├── ChainDecorations.tsx
│   ├── Divider.tsx
│   ├── Input.tsx
│   ├── Label.tsx
│   └── TextLink.tsx
│
├── molecules/        # Compositions of atoms
│   ├── DividerWithText.tsx
│   ├── FormField.tsx      # Label + Input + error message
│   ├── RememberMeRow.tsx  # Checkbox + TextLink
│   └── SocialLoginButton.tsx
│
├── organisms/        # Self-contained UI sections
│   ├── AuthBanner.tsx
│   ├── LoginForm.tsx
│   └── SocialLoginGroup.tsx
│
└── templates/        # Page layout wrappers
    └── AuthLayout.tsx
```

**Rule:** When implementing a Figma design, match components to the correct Atomic level.
Always reuse existing atoms/molecules before creating new ones.

### Component API Conventions

#### Atoms — minimal, composable

```tsx
// Variant-based styling via discriminated union
type Variant = 'primary' | 'ghost'
<Button variant="primary" fullWidth>Submit</Button>
<Button variant="ghost">Cancel</Button>

// invalid flag for error states
<Input invalid={true} />
<Checkbox id="x" checked={bool} onChange={fn} label="..." />
```

#### Molecules — composed from atoms, with business props

```tsx
// FormField wraps Label + Input + error
<FormField
  id="email"
  label="E-mail"
  type="email"
  value={value}
  onChange={(val: string) => ...}  // simplified signature — no SyntheticEvent
  invalid={!!error}
  errorMessage={error}
/>
```

Note the `onChange` signature: `(value: string) => void` (not `React.ChangeEvent`).

#### Templates — layout-only, no domain logic

```tsx
<AuthLayout
  banner={<AuthBanner imageSrc="..." imageAlt="..." />}
  form={<LoginForm onSubmit={fn} />}
/>
```

---

## 3. STYLING APPROACH

### CSS Methodology

- **Tailwind CSS v4 utility classes** — no CSS Modules, no Styled Components, no CSS-in-JS.
- Class merging: **no utility (cn/clsx)** is currently installed. Concatenate conditionally with template literals.
- Responsive: Tailwind's standard `md:` prefix. Current breakpoints: mobile-first, `md:` for two-column layout.

### Variant Classes Pattern

```tsx
const variantClasses: Record<Variant, string> = {
  primary: 'bg-brand hover:bg-brand-hover text-on-brand font-semibold',
  ghost:   'text-ink hover:bg-field',
}
// Applied inline:
className={`...base classes... ${variantClasses[variant]} ...`}
```

### Error / Validation States

- Invalid border: `border-red-500` (uses Tailwind's built-in red scale, not a custom token)
- Error text: `text-xs text-red-500`
- Focus ring for accessibility: `peer-focus-visible:ring-2 peer-focus-visible:ring-brand`

### Decorative Elements

The `ChainDecorations` component renders three oversized chain-link SVGs absolutely positioned
in the `AuthLayout` background. Uses `text-chain opacity-40 rotate-12` etc.

---

## 4. ASSET MANAGEMENT

### Static Assets

All static assets are placed in `apps/web/public/` and referenced by absolute path from root:

| File | Used in |
|---|---|
| `public/IMG2_Tablet.png` | `AuthBanner` — hero image |
| `public/Github.png` | `SocialLoginButton` — provider icon |
| `public/Google.png` | `SocialLoginButton` — provider icon |
| `public/Login.png` | Available, not yet referenced |
| `public/Login-2.png` | Available, not yet referenced |
| `public/favicon.svg` | `index.html` |

**Rule:** Reference public assets as `/filename.ext` (root-relative, no Vite import). They are
served as-is, not hashed.

### Fonts

Loaded from Google Fonts CDN via `<link>` in `index.html` — **not** self-hosted:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@500;600&display=swap" rel="stylesheet" />
```

Applied globally: `font-family: var(--font-sans)` in `body` (via `index.css`).

---

## 5. ICON SYSTEM

There is **no icon library installed** (`lucide-react`, `heroicons`, etc. are NOT available).

All icons are **inline SVG components** authored directly in the component file:

```tsx
// Example: checkmark in Checkbox.tsx
<svg className="w-2.5 h-2.5 text-on-brand" viewBox="0 0 10 8" fill="none" aria-hidden="true">
  <path d="M1 4L3.5 6.5L9 1" stroke="currentColor" strokeWidth="1.5"
        strokeLinecap="round" strokeLinejoin="round" />
</svg>

// Example: chain link in ChainDecorations.tsx
<svg viewBox="0 0 160 160" fill="none" className="w-full h-full" aria-hidden="true">
  <rect x="50" y="10" width="60" height="140" rx="30" stroke="currentColor" strokeWidth="12" />
  <rect x="10" y="60" width="140" height="60" rx="30" stroke="currentColor" strokeWidth="12" />
</svg>
```

**Rules:**
- All decorative icons: `aria-hidden="true"`
- Icon color: use `currentColor` + `text-*` class on parent for theming
- Size: controlled via `w-*` / `h-*` utility classes
- Do NOT install an icon package unless explicitly requested

---

## 6. LAYOUT PATTERNS

### Page Layout — AuthLayout

```
┌────────────────────────────────────────────┐
│  bg-page  (full viewport, centered content) │
│  ChainDecorations (absolute, decorative)    │
│                                             │
│  ┌──────────────────────────────────────┐  │
│  │ bg-card  rounded-card  shadow-card   │  │
│  │                                      │  │
│  │  [col 1: AuthBanner]  [col 2: Form] │  │
│  │  h-52 mobile / h-auto md            │  │
│  └──────────────────────────────────────┘  │
└────────────────────────────────────────────┘
```

Grid: `grid-cols-1 md:grid-cols-2`, max-width `max-w-4xl`, padding `px-8 py-10` on form column.

### Color Semantics (dark theme)

| Layer | Token | Hex |
|---|---|---|
| Page background | `bg-page` | `#0b0d10` |
| Card / modal | `bg-card` | `#1a1d23` |
| Input / ghost button | `bg-field` | `#262a31` |
| Borders / dividers | `border-edge` / `bg-edge` | `#3a3f47` |
| Decorative SVG | `text-chain` | `#1f2329` |
| Primary text | `text-ink` | `#e5e7eb` |
| Secondary text | `text-ink-muted` | `#9ca3af` |
| Brand accent | `text-brand` / `bg-brand` | `#a6f163` |
| Text on brand | `text-on-brand` | `#0b0d10` |

---

## 7. PROJECT STRUCTURE (apps/web)

```
apps/web/
├── public/                   # Static assets — referenced as /filename
│   ├── favicon.svg
│   ├── IMG2_Tablet.png
│   ├── Github.png
│   ├── Google.png
│   └── Login*.png
│
├── src/
│   ├── main.tsx              # Entry — mounts <App /> into #app
│   ├── App.tsx               # Root component (currently renders LoginPage)
│   ├── index.css             # @theme tokens + global body styles
│   │
│   ├── components/
│   │   ├── atoms/            # Button, Checkbox, ChainDecorations, Divider, Input, Label, TextLink
│   │   ├── molecules/        # DividerWithText, FormField, RememberMeRow, SocialLoginButton
│   │   ├── organisms/        # AuthBanner, LoginForm, SocialLoginGroup
│   │   └── templates/        # AuthLayout
│   │
│   └── pages/
│       └── LoginPage.tsx     # Composes AuthLayout + AuthBanner + LoginForm
│
├── index.html                # HTML shell — fonts loaded here
├── vite.config.ts            # Plugins: @vitejs/plugin-react + @tailwindcss/vite; alias @/ → src/
├── tsconfig.json             # strict + erasableSyntaxOnly + bundler resolution
└── package.json
```

---

## 8. FIGMA → CODE WORKFLOW (this app)

### Step-by-step

1. Call `get_design_context` + `get_screenshot` with the Figma file/node.
2. Map each Figma layer to the Atomic Design level (atom / molecule / organism / template / page).
3. Check `src/components/` for an existing component before creating a new one.
4. Translate Figma color fills → semantic token classes (see table in §6). Never hardcode hex.
5. Translate Figma corner radius → `rounded-field` (8 px) or `rounded-card` (20 px).
6. Translate Figma shadow on cards → `shadow-card`.
7. Inline SVG icons from Figma assets; add `aria-hidden="true"` and `currentColor`.
8. Static images → `public/` directory, reference as `/filename.ext`.
9. Verify visually against the Figma screenshot before marking complete.

### Common Figma → Token Mappings

| Figma Style | Token Class |
|---|---|
| Background `#0b0d10` | `bg-page` |
| Card fill `#1a1d23` | `bg-card` |
| Input fill `#262a31` | `bg-field` |
| Border stroke `#3a3f47` | `border-edge` |
| Primary text `#e5e7eb` | `text-ink` |
| Muted text `#9ca3af` | `text-ink-muted` |
| Lime accent `#a6f163` | `bg-brand` / `text-brand` |
| Lime hover `#94e055` | `hover:bg-brand-hover` |
| Text on lime `#0b0d10` | `text-on-brand` |
| Corner radius 8 px | `rounded-field` |
| Corner radius 20 px | `rounded-card` |
| Card drop shadow | `shadow-card` |

---

## 9. TYPESCRIPT RULES (affects component authoring)

- `strict: true` — all props must be typed.
- `erasableSyntaxOnly: true` — do NOT use `const enum`, decorators, `namespace`, or `enum` (use `type` unions instead).
- `verbatimModuleSyntax: true` — import types with `import type { ... }`.
- `noUnusedLocals` + `noUnusedParameters: true` — no dead code.
- Inline function prop types rather than `React.FC<>`.

```ts
// Correct
import type { ReactNode } from 'react'
type Props = { children: ReactNode }
export function MyComp({ children }: Props) { ... }

// Incorrect — enum forbidden
enum Variant { Primary, Ghost }   // ❌ use type Variant = 'primary' | 'ghost'
```

---

## 10. ENVIRONMENT VARIABLES

Prefix: `VITE_` (Vite convention — accessible in browser via `import.meta.env`).

| Variable | Purpose |
|---|---|
| `VITE_API_URL` | Backend API base URL |
| `VITE_GITHUB_CLIENT_ID` | GitHub OAuth (future) |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth (future) |

Template at `apps/web/.env.example`. Never commit `.env.local`.
