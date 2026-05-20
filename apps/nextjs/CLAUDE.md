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
