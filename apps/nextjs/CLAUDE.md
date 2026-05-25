@AGENTS.md

# CodeConnect — Frontend & API rules

## Frontend: Atomic Design

Components live under `components/` organized by layer:

```
components/
├── atoms/      # Smallest primitives — no business logic, purely presentational
├── molecules/  # Composed from atoms — local state allowed, no API calls
├── organisms/  # Complex sections — can read from context/hooks, no direct API calls
└── templates/  # Layout shells — structure only, no data, content via props/children
```

Pages (data fetching) are Next.js App Router routes under `app/`. Data fetching happens at this layer — either via Server Components or client-side hooks. Never fetch data inside organisms or below.

Layer boundaries:
- Atoms have no dependencies on other components.
- Molecules import only atoms.
- Organisms import atoms and molecules.
- Templates import organisms and molecules, but own no data.
- Routes (`app/**`) import templates and organisms, and own data.

## Frontend: Styling

Tailwind v4 — CSS-first. Rules:
- Never use inline `style={{}}` when a Tailwind class exists.
- Custom design tokens go in `@theme` blocks inside `app/globals.css` — not in a separate config file.
- Dark mode uses `@media (prefers-color-scheme: dark)` with CSS variables on `:root`.

### Colors — extend the theme, never hardcode

- Forbidden in components: `bg-[#81fe88]`, `text-[#e1e1e1]`, `border-[#00090e]` — any `[#xxxxxx]` in a class is a bug.
- Extend the palette in `@theme` with a **two-layer pattern**:
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

- Both layers generate Tailwind utilities automatically (`bg-verde-destaque` AND `bg-brand`). Components MUST use the **semantic alias** (`bg-brand`, `text-ink`), never the raw name directly — that keeps Figma renames isolated to `globals.css`.

### Sizes — use Tailwind tokens, not arbitrary pixels

- Forbidden in components: `text-[15px]`, `gap-[12px]`, `p-[18px]`, `rounded-[20px]` — any `[NNpx]` in a class is a bug.
- Map every Figma pixel value to the closest Tailwind token:

  | Figma size | Token | px |
  |---|---|---|
  | 12 / 12.5 | `text-xs` | 12 |
  | 14 / 15 | `text-sm` | 14 |
  | 16 | `text-base` | 16 |
  | 18 | `text-lg` | 18 |
  | 20 / 22 | `text-xl` | 20 |
  | 24 / 26 | `text-2xl` | 24 |
  | 30 | `text-3xl` | 30 |

- When a Figma value sits exactly between two tokens (e.g. 22px between `text-xl` 20px and `text-2xl` 24px), pick the **smaller** one — staying conservative reads better and avoids visual creep.
- Same rule for the spacing scale (`gap-*`, `p-*`, `m-*`, `w-*`, `h-*`): prefer the 4px-step Tailwind scale (`gap-2` = 8px, `gap-4` = 16px) over arbitrary `[12px]`.

### Radius and shadows

- Define semantic radius tokens in `@theme`: `--radius-card`, `--radius-field`, `--radius-button`.
- Components use semantic utilities (`rounded-card`, `rounded-field`, `rounded-button`) — never arbitrary `rounded-[NNpx]`.

### Extending the scale when no token fits

If a design value sits clearly outside the closest Tailwind token (e.g. a 420px decorative element with no acceptable equivalent in the default spacing scale), **extend the theme** in `globals.css` rather than dropping to an arbitrary value:

```css
@theme {
  --spacing-decoration-lg: 26rem;  /* 416px */
}
```

This generates `w-decoration-lg`, `h-decoration-lg`, etc. Same rule as colors: tokens in `@theme`, never `[NNpx]` in a class — not even for decorative ornaments.

## Frontend: Component tests

Every component file must have a co-located test file:

```
components/atoms/Button.tsx
components/atoms/Button.test.tsx   ← required
```

Test stack: **Vitest + @testing-library/react**.

Each test must cover at minimum:
1. Renders without crashing given its required props.
2. Its essential interaction — a button fires `onClick`, an input updates on change, a link renders the correct `href`, etc.

Run all tests: `pnpm test`
Run a single test file: `pnpm test Button.test.tsx`

## Backend: REST principles

All API routes (Next.js Route Handlers under `app/api/` or a separate `apps/api`) must follow these rules:

**URLs — nouns only, no verbs:**
```
GET    /api/v1/posts          # list
GET    /api/v1/posts/:id      # get one
POST   /api/v1/posts          # create
PATCH  /api/v1/posts/:id      # partial update
DELETE /api/v1/posts/:id      # delete
```

**HTTP status codes:**

| Situation | Code |
|---|---|
| Success (read/update) | 200 |
| Created | 201 |
| No content (delete) | 204 |
| Validation error | 422 |
| Unauthorized | 401 |
| Forbidden | 403 |
| Not found | 404 |
| Conflict | 409 |
| Server error | 500 |

**Response envelope — always consistent:**
```json
{ "data": ..., "error": null, "meta": { "page": 1, "total": 42 } }
```
On error: `data` is `null`, `error` has `{ "code": "VALIDATION_ERROR", "message": "..." }`.

**Other rules:**
- All routes versioned under `/api/v1/`.
- No session state on the server — stateless by design.
- Validate request body with Zod before any business logic.
