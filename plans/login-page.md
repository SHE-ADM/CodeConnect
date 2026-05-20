# Página de Login — CodeConnect (apps/web)

## Contexto

O monorepo CodeConnect contém o app `apps/web` em React + Vite + Tailwind. O usuário pediu para implementar a tela de **Login** seguindo o mockup fornecido (card escuro com banner à esquerda + formulário à direita, sobre fundo preto decorado com correntes; CTA verde-lima). A página de Cadastro virá depois e deve reusar o mesmo layout — banner e formulário trocáveis.

**Problema descoberto durante a exploração:** `create-vite@9.0.7` com `--template react-ts` gerou um projeto **vanilla TypeScript**, não React. Antes de qualquer UI, é preciso converter o app para React.

**Decisões alinhadas com o usuário:**
1. Converter `apps/web` para React + TS (preserva config Tailwind v4 já existente).
2. Sem `react-router-dom` agora — `App.tsx` renderiza `LoginPage` direto; trocar para `<RegisterPage />` quando necessário é uma linha.
3. RegisterPage será uma página dedicada futura, reutilizando o `AuthLayout` (banner + formulário como slots).

## Estado atual de `apps/web`

- Vite 8.0.12, TS 6.0.2, Tailwind 4.3.0 via `@tailwindcss/vite` (CSS-first, sem `tailwind.config.ts`).
- `tsconfig.json` com `erasableSyntaxOnly: true` e `verbatimModuleSyntax: true` → tipos só com `import type`, sem `enum`/decorators.
- Assets confirmados em `public/`: `Github.png`, `Google.png`, `IMG2_Tablet.png`, `Login.png`, `Login-2.png`, `favicon.svg`, `icons.svg`.
- Logo "code connect" do mockup **está embutida** em `IMG2_Tablet.png` — sem overlay necessário.
- A pasta `src/` tem apenas template demo (vanilla TS) que será descartado.

## Decisões de design adotadas

| Item | Valor | Justificativa |
|---|---|---|
| Verde primário (CTA, links) | `#A6F163` | Reproduz o lime saturado do mockup |
| Verde hover | `#94E055` | Variante 10% mais escura |
| Fundo de página | `#0B0D10` | Preto azulado do mockup |
| Card | `#1A1D23` | Cinza grafite do card central |
| Input / botão social | `#262A31` | Tom intermediário visível sobre o card |
| Borda / divider | `#3A3F47` | Cinza neutro |
| Texto principal | `#E5E7EB` | Branco quente |
| Texto secundário | `#9CA3AF` | Cinza claro (labels, placeholder) |
| Correntes decorativas | `#1F2329` em `opacity-60` | Cor próxima do fundo, traço sutil |
| Fonte | **Inter** (Google Fonts via `<link>` no `index.html`) | Sans-serif geométrico moderno alinhado ao mockup |
| Radius card / input / sm | 20px / 8px / 4px | Card mais arredondado, inputs e checkbox menores |

Tokens serão definidos em `apps/web/src/index.css` com `@theme` do Tailwind v4, expondo utilitários como `bg-surface-1`, `text-primary`, `rounded-card`.

## Plano de execução

### 1. Conversão para React (passos 1–5)

1. Adicionar dependências no workspace:
   - `pnpm --filter web add react@^19.2.0 react-dom@^19.2.0`
   - `pnpm --filter web add -D @vitejs/plugin-react@^5 @types/react@^19 @types/react-dom@^19`
2. Atualizar [apps/web/vite.config.ts](../apps/web/vite.config.ts):
   - importar `@vitejs/plugin-react` e adicionar `react()` antes de `tailwindcss()`
   - adicionar `resolve.alias`: `'@': path.resolve(__dirname, 'src')`
3. Atualizar [apps/web/tsconfig.json](../apps/web/tsconfig.json) — em `compilerOptions`:
   - `"jsx": "react-jsx"`
   - `"baseUrl": "."`
   - `"paths": { "@/*": ["src/*"] }`
4. Atualizar [apps/web/index.html](../apps/web/index.html):
   - `<html lang="pt-BR">`
   - `<title>CodeConnect — Login</title>`
   - `<script type="module" src="/src/main.tsx">`
   - Adicionar `<link>` para Inter (`preconnect` + `family=Inter:wght@400;500;600;700`)
5. Apagar arquivos do template demo:
   - `src/main.ts`, `src/counter.ts`, `src/style.css`
   - `src/assets/hero.png`, `src/assets/typescript.svg`, `src/assets/vite.svg`
   - `public/icons.svg` (era do Vite, não usamos)
   - Manter `public/favicon.svg`

### 2. Esqueleto React + Tailwind v4 (passos 6–8)

6. Criar `apps/web/src/index.css`:
   - `@import "tailwindcss";`
   - bloco `@theme` com todos os tokens da tabela acima (cores, font-sans, radius, shadow)
   - reset minimal em `html`, `body`, `#app` (background, color, font-family, antialiased, min-h-screen)
7. Criar `apps/web/src/main.tsx`:
   - `createRoot(document.getElementById('app')).render(<StrictMode><App /></StrictMode>)`
8. Criar `apps/web/src/App.tsx`:
   - retorna `<LoginPage />`

### 3. Componentes Atomic Design (passos 9–13)

Estrutura de pastas:
```
apps/web/src/
├── components/
│   ├── atoms/        Button, Input, Label, Checkbox, TextLink, Divider, ChainDecorations
│   ├── molecules/    FormField, RememberMeRow, SocialLoginButton, DividerWithText
│   ├── organisms/    LoginForm, SocialLoginGroup, AuthBanner
│   └── templates/    AuthLayout
└── pages/            LoginPage
```

**9. Atoms** — componentes puros, sem estado de domínio.

| Arquivo | Props principais | Notas para reuso |
|---|---|---|
| `atoms/Button.tsx` | `variant: 'primary'\|'social'\|'ghost'`, `type`, `fullWidth`, `leftIcon`, `rightIcon`, `children`, `onClick`, `disabled` | Reuso em Register: idem |
| `atoms/Input.tsx` | extends `InputHTMLAttributes<HTMLInputElement>` + `invalid?` | Forwarda ref. Mesmo átomo em todos os campos do Register |
| `atoms/Label.tsx` | `htmlFor`, `children` | — |
| `atoms/Checkbox.tsx` | `id`, `checked`, `onChange(v)`, `label` | — |
| `atoms/TextLink.tsx` | `href`, `children`, `underline?` | "Esqueci a senha", "Crie seu cadastro", "Já tenho conta" (Register) |
| `atoms/Divider.tsx` | `className?` | linha `h-px bg-surface-3` |
| `atoms/ChainDecorations.tsx` | — | SVG inline com 3–4 elos de corrente em `absolute` + opacidade baixa, espalhados no fundo da `AuthLayout`. Se o usuário entregar asset depois, basta trocar |

**10. Molecules** — composições simples.

| Arquivo | Composição | Reuso no Register |
|---|---|---|
| `molecules/FormField.tsx` | `Label` + `Input`. Props: `id`, `label`, `type`, `placeholder`, `value`, `onChange`, `autoComplete`, `required` | Sim — usado 4x (nome, email, senha, confirmar) |
| `molecules/RememberMeRow.tsx` | `Checkbox` + `TextLink` em `flex justify-between` | Específico do Login |
| `molecules/SocialLoginButton.tsx` | `Button variant="social"` + `<img src="/Github.png\|/Google.png">` + label. Prop `provider: 'github'\|'google'` | Sim |
| `molecules/DividerWithText.tsx` | linha + texto centralizado + linha em `flex items-center gap-3` | Sim |

**11. Organisms** — agregados específicos da feature.

| Arquivo | Composição | Reuso |
|---|---|---|
| `organisms/AuthBanner.tsx` | `<img>` com `imageSrc`/`imageAlt`. Estilo `rounded-image object-cover w-full h-full` | Sim — RegisterPage passa outra imagem |
| `organisms/SocialLoginGroup.tsx` | 2× `SocialLoginButton` (github + google) em `flex gap-4 justify-center` | Sim |
| `organisms/LoginForm.tsx` | título "Login" + subtítulo + 2× `FormField` (email, senha) + `RememberMeRow` + `Button primary submit` "Login →" + `DividerWithText` "ou entre com outras contas" + `SocialLoginGroup` + linha "Ainda não tem conta?" + `TextLink` "Crie seu cadastro!". Estado local com `useState`. Props: `onSubmit({identifier, password, remember})` | Substituído por `RegisterForm` na Register |

**12. Template** — `templates/AuthLayout.tsx`

- Props: `banner: ReactNode`, `form: ReactNode` (slots nomeados em vez de `children` único — comunica explicitamente as duas regiões e força TS a validar ambas).
- Estrutura:
  - container externo `min-h-screen w-full flex items-center justify-center bg-surface-0 p-4 relative overflow-hidden`
  - `<ChainDecorations />` posicionada absolutamente no fundo
  - card `relative z-10 bg-surface-1 rounded-card shadow-card grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 p-6 md:p-8 max-w-4xl w-full`
  - slot banner sempre visível (mobile mostra acima do form, igual a `Login-2.png`)
  - slot form: `flex flex-col justify-center`

**13. Page** — `pages/LoginPage.tsx`

```tsx
<AuthLayout
  banner={<AuthBanner imageSrc="/IMG2_Tablet.png" imageAlt="Ilustração CodeConnect" />}
  form={<LoginForm onSubmit={data => console.log('login submit', data)} />}
/>
```

A futura `RegisterPage` será simétrica: mesmo `AuthLayout`, mesmo `AuthBanner` (com imageSrc trocada se vier outro asset), e um `RegisterForm` distinto.

### 4. Verificação (passos 14–15)

14. `pnpm --filter web dev` — abrir no browser e comparar contra `public/Login.png` e `public/Login-2.png` (desktop e mobile). Validar:
    - Visual ≥95% próximo aos mockups
    - Submit do form dispara `console.log` com `{identifier, password, remember}`
    - Botões sociais renderizam com `Github.png` e `Google.png`
    - Link "Crie seu cadastro!" e "Esqueci a senha" estilizados em verde-lima
    - Mobile: banner aparece acima do form (sem `hidden`)
    - Sem warnings de React no console (StrictMode ativo)
15. `pnpm --filter web build` — garantir que `tsc` passa com as flags estritas (`erasableSyntaxOnly`, `verbatimModuleSyntax`, `noUnusedLocals`, `noUnusedParameters`).

## Acessibilidade

- `<html lang="pt-BR">`, `<h1>Login</h1>` como título da página.
- `FormField` associa `<Label htmlFor>` ao `<Input id>`.
- `autoComplete="username"` no campo email-ou-usuário, `autoComplete="current-password"` na senha.
- Botões sociais com `aria-label="Entrar com Github"` / `"Entrar com Gmail"`; `<img>` interno com `alt=""` `aria-hidden="true"` (label já visível ao lado).
- `focus:outline-none focus:ring-2 focus:ring-primary/40` em inputs e botões.
- Botão CTA `type="submit"`; sociais `type="button"`.

## Critical files

Arquivos a criar:
- [apps/web/src/index.css](../apps/web/src/index.css)
- [apps/web/src/main.tsx](../apps/web/src/main.tsx)
- [apps/web/src/App.tsx](../apps/web/src/App.tsx)
- [apps/web/src/components/atoms/Button.tsx](../apps/web/src/components/atoms/Button.tsx)
- [apps/web/src/components/atoms/Input.tsx](../apps/web/src/components/atoms/Input.tsx)
- [apps/web/src/components/atoms/Label.tsx](../apps/web/src/components/atoms/Label.tsx)
- [apps/web/src/components/atoms/Checkbox.tsx](../apps/web/src/components/atoms/Checkbox.tsx)
- [apps/web/src/components/atoms/TextLink.tsx](../apps/web/src/components/atoms/TextLink.tsx)
- [apps/web/src/components/atoms/Divider.tsx](../apps/web/src/components/atoms/Divider.tsx)
- [apps/web/src/components/atoms/ChainDecorations.tsx](../apps/web/src/components/atoms/ChainDecorations.tsx)
- [apps/web/src/components/molecules/FormField.tsx](../apps/web/src/components/molecules/FormField.tsx)
- [apps/web/src/components/molecules/RememberMeRow.tsx](../apps/web/src/components/molecules/RememberMeRow.tsx)
- [apps/web/src/components/molecules/SocialLoginButton.tsx](../apps/web/src/components/molecules/SocialLoginButton.tsx)
- [apps/web/src/components/molecules/DividerWithText.tsx](../apps/web/src/components/molecules/DividerWithText.tsx)
- [apps/web/src/components/organisms/AuthBanner.tsx](../apps/web/src/components/organisms/AuthBanner.tsx)
- [apps/web/src/components/organisms/SocialLoginGroup.tsx](../apps/web/src/components/organisms/SocialLoginGroup.tsx)
- [apps/web/src/components/organisms/LoginForm.tsx](../apps/web/src/components/organisms/LoginForm.tsx)
- [apps/web/src/components/templates/AuthLayout.tsx](../apps/web/src/components/templates/AuthLayout.tsx)
- [apps/web/src/pages/LoginPage.tsx](../apps/web/src/pages/LoginPage.tsx)

Arquivos a modificar:
- [apps/web/package.json](../apps/web/package.json) (via `pnpm add` — não editar manual)
- [apps/web/vite.config.ts](../apps/web/vite.config.ts)
- [apps/web/tsconfig.json](../apps/web/tsconfig.json)
- [apps/web/index.html](../apps/web/index.html)

Arquivos a deletar:
- `apps/web/src/main.ts`, `src/counter.ts`, `src/style.css`
- `apps/web/src/assets/hero.png`, `typescript.svg`, `vite.svg`
- `apps/web/public/icons.svg`

## Verificação end-to-end

1. `pnpm install` na raiz (caso a instalação tenha sido feita por filtro).
2. `pnpm dev:web` — abrir `http://localhost:5173`. Conferir:
   - layout idêntico aos mockups em desktop (>= 1024px) e mobile (< 768px)
   - submit do form com Enter ou clique no botão dispara `console.log`
   - estados de foco visíveis nos inputs e botões
   - botões sociais renderizam com Github.png / Google.png
3. `pnpm build:web` — TS compila sem erro com as flags estritas.
4. (Manual) confirmar que substituir `LoginPage` por uma futura `RegisterPage` no `App.tsx` exige apenas trocar o componente — o `AuthLayout` aceita banner e form como slots e está pronto para reuso.

## Itens em aberto (não bloqueantes)

1. **Cor exata do verde:** adotado `#A6F163`. Se a Alura tiver paleta oficial diferente, basta ajustar o token em `index.css`.
2. **Fonte:** adotado Inter. Se houver fonte oficial CodeConnect (ex.: Rubik), trocar o token `--font-sans`.
3. **Correntes decorativas:** adotado SVG inline em `ChainDecorations`. Se o usuário entregar PNG/SVG oficial depois, substituir o conteúdo do componente.
4. **Ações dos links** "Esqueci a senha" e "Crie seu cadastro!": `href="#"` por ora; ligar a navegação quando rotear.
5. **Validação de form:** apenas atributos nativos (`required`, `type="email"`) nesta fase; react-hook-form + Zod podem entrar depois.
6. **Lint:** `apps/web` não tem ESLint hoje; fora do escopo desta entrega.
