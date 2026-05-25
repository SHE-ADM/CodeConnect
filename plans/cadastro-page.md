# Cadastro Page — `apps/web`

## Context

Implementar a página de Cadastro reutilizando o máximo possível da arquitetura Atomic Design já feita na Login (atoms · molecules · organisms · template), e alinhar tokens visuais ao Figma (fonte Prompt, brand `#81FE88`, surfaces `#171D1F`, input claro `#888888`). O alinhamento de tokens também afeta a Login — é intencional, já que o Figma é a fonte de verdade.

Navegação entre Login ↔ Cadastro: `NavigationContext` (state-based, sem react-router).
Ícones Material (`arrow_forward`, `login`): inline SVG.

**Figma node:** `155:3425` no arquivo `BakVoeQ85l1EH5gDWWmiYF`.

## Resumo do design (Figma)

Card único, vertical em mobile, com:
- Banner topo (`/IMG2_Tablet.png`, reusa `AuthBanner`)
- Título "Cadastro" (Prompt SemiBold 26px) + subtítulo "Olá! Preencha seus dados." (Prompt Regular 22px)
- 3 inputs (Prompt Regular 18px label / 15px placeholder): **Nome** ("Nome completo") · **Email** ("Digite seu email") · **Senha** ("******")
- Checkbox **"Lembrar-me"** abaixo da Senha (sem "Esqueci a senha")
- Botão **Cadastrar** (verde `#81FE88`, texto `#132E35`) com ícone `arrow_forward` (Material)
- Divider "ou entre com outras contas" + grupo Github + Gmail
- Link rodapé: "Já tem conta? **Faça seu login!**" + ícone `login` (Material)

## Approach

### 1. Tokens — atualizar `apps/web/src/index.css`

Substituir o bloco `@theme` para refletir o Figma:

```css
--color-page:        #171d1f;  /* era #0b0d10 */
--color-card:        #171d1f;  /* era #1a1d23  — card e page agora coincidem */
--color-card-border: #00090e;  /* novo — borda do card no Figma */
--color-field:       #888888;  /* era #262a31 — input claro */
--color-field-ink:   #171d1f;  /* novo — texto dentro do input */
--color-edge:        #3a3f47;  /* mantido */
--color-chain:       #1f2329;  /* mantido */
--color-ink:         #e1e1e1;  /* era #e5e7eb */
--color-ink-muted:   #888888;  /* alinhado ao "Cinza médio" */
--color-on-brand:    #132e35;  /* era #0b0d10 — Verde petróleo */
--color-brand:       #81fe88;  /* era #a6f163 */
--color-brand-hover: #6fe076;  /* derivado 5% mais escuro */
--radius-card:       32px;     /* era 20px */
--radius-field:      4px;      /* era 8px */
--radius-button:     8px;      /* novo — botões */
--font-sans:         'Prompt', system-ui, -apple-system, 'Segoe UI', sans-serif;
```

### 2. Fonte — atualizar `apps/web/index.html`

Trocar o `<link>` do Google Fonts:
- de Inter (pesos 500, 600)
- para `Prompt` (pesos 400, 600) — único arquivo, sem itálicos.

### 3. Atoms — ajustes finos

#### `apps/web/src/components/atoms/Input.tsx`
- Mudar texto interno para `text-field-ink` (escuro sobre fundo claro `#888`).
- Placeholder também usa `text-field-ink/70` ou similar.
- `rounded-field` continua válido (agora 4px).

#### `apps/web/src/components/atoms/Button.tsx`
- Trocar `rounded-field` por `rounded-button` (8px).
- Adicionar slot opcional para ícone à direita: alterar `children: ReactNode` para aceitar ícone via `endIcon?: ReactNode` (ou simplesmente compor `<>Texto <Icon /></>` no consumidor — preferível, mantém atom puro).
- **Decisão:** manter Button puro e compor ícone no consumidor — sem mudança de API.

#### `apps/web/src/components/atoms/Checkbox.tsx`
- Verificar visual com novos tokens: borda `border-ink-muted` (cinza médio), check em `text-on-brand` ou white. Validar contra o Figma.

#### `apps/web/src/components/atoms/icons/ArrowForwardIcon.tsx` — NOVO
```tsx
type Props = { className?: string }
export function ArrowForwardIcon({ className }: Readonly<Props>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
    </svg>
  )
}
```

#### `apps/web/src/components/atoms/icons/LoginIcon.tsx` — NOVO
SVG inline do Material `login` (24×24).

### 4. Template e organismos compartilhados — reuso direto

Sem alterações:
- `AuthLayout` (template) — já aceita `banner` + `form` slots
- `AuthBanner` (organism) — mesmo `/IMG2_Tablet.png`
- `SocialLoginGroup` (organism) — botões Github + Gmail
- `DividerWithText` (molecule)
- `FormField` (molecule) — API atual já cobre Nome/Email/Senha

### 5. Ajuste fino: `SocialLoginButton.tsx`

Trocar label `"Google"` → `"Gmail"` (Figma usa "Gmail"). Manter `provider: 'google'` internamente (apenas o label muda).

### 6. NavigationContext — novo arquivo

`apps/web/src/contexts/NavigationContext.tsx`:
```tsx
import { createContext, useContext, useState, type ReactNode } from 'react'

export type AuthPage = 'login' | 'cadastro'

type NavigationValue = Readonly<{
  page: AuthPage
  navigate: (page: AuthPage) => void
}>

const NavigationContext = createContext<NavigationValue | null>(null)

export function NavigationProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [page, setPage] = useState<AuthPage>('login')
  return (
    <NavigationContext.Provider value={{ page, navigate: setPage }}>
      {children}
    </NavigationContext.Provider>
  )
}

export function useNavigation(): NavigationValue {
  const ctx = useContext(NavigationContext)
  if (!ctx) throw new Error('useNavigation must be used inside NavigationProvider')
  return ctx
}
```

### 7. Organismo novo — `CadastroForm.tsx`

`apps/web/src/components/organisms/CadastroForm.tsx`:
- Espelha o padrão de `LoginForm` (useState, useCallback, validate, FormErrors, duck-typed submit event).
- Estado: `{ name, email, password, remember }`.
- Validação:
  - `name.trim()` vazio → "Informe seu nome."
  - `email`: regex simples `/^\S+@\S+\.\S+$/` → "E-mail inválido."
  - `password.length < 6` → "Senha deve ter ao menos 6 caracteres."
- Layout (top→bottom):
  1. `<h1>Cadastro</h1>` (text-2xl semibold)
  2. `<p>Olá! Preencha seus dados.</p>` (text-lg, ink)
  3. `<FormField id="name" label="Nome" placeholder="Nome completo" autoComplete="name" />`
  4. `<FormField id="email" type="email" label="Email" placeholder="Digite seu email" autoComplete="email" />`
  5. `<FormField id="password" type="password" label="Senha" placeholder="******" autoComplete="new-password" />`
  6. `<Checkbox id="remember" label="Lembrar-me" />` (atom direto — sem RememberMeRow)
  7. `<Button type="submit" variant="primary" fullWidth>Cadastrar <ArrowForwardIcon className="w-5 h-5" /></Button>`
  8. `<DividerWithText>ou entre com outras contas</DividerWithText>`
  9. `<SocialLoginGroup />`
  10. Rodapé: `<p>Já tem conta? <TextLink onClick={() => navigate('login')}>Faça seu login! <LoginIcon /></TextLink></p>`
- Props: `{ onSubmit: (data: CadastroData) => void }` onde `CadastroData = { name: string; email: string; password: string; remember: boolean }`.
- Usar `useNavigation()` para o link de rodapé.

### 8. Page nova — `CadastroPage.tsx`

`apps/web/src/pages/CadastroPage.tsx`:
```tsx
import { useCallback } from 'react'
import { AuthLayout } from '@/components/templates/AuthLayout'
import { AuthBanner } from '@/components/organisms/AuthBanner'
import { CadastroForm } from '@/components/organisms/CadastroForm'

export default function CadastroPage() {
  const handleCadastro = useCallback(
    (_data: { name: string; email: string; password: string; remember: boolean }) => {
      // TODO: integrate with authentication API
    },
    []
  )
  return (
    <AuthLayout
      banner={<AuthBanner imageSrc="/IMG2_Tablet.png" imageAlt="Ilustração CodeConnect — pessoa programando" />}
      form={<CadastroForm onSubmit={handleCadastro} />}
    />
  )
}
```

### 9. Atualizar `LoginForm.tsx`

- Substituir o `→` textual do botão "Login" por `<ArrowForwardIcon />` (consistência com Cadastro).
- Substituir o `href="/cadastro"` do TextLink "Crie seu cadastro!" por `onClick={() => navigate('cadastro')}` usando `useNavigation()` (continuar com `as="button"` ou trocar o atom para aceitar `onClick`).
- Validar `TextLink` atom: hoje é `<a>`. Se for necessário, ampliar TextLink para aceitar `onClick` (já forwarda `AnchorHTMLAttributes`, então funciona via `onClick` + `role="button"`); ou adicionar variant `<button>`.
- **Decisão:** TextLink já forwarda `onClick` via `AnchorHTMLAttributes`; usar `href="#"` + `onClick={(e) => { e.preventDefault(); navigate('cadastro') }}`. Mínimo invasivo.

### 10. `App.tsx`

```tsx
import { NavigationProvider, useNavigation } from '@/contexts/NavigationContext'
import LoginPage from '@/pages/LoginPage'
import CadastroPage from '@/pages/CadastroPage'

function Router() {
  const { page } = useNavigation()
  return page === 'cadastro' ? <CadastroPage /> : <LoginPage />
}

export default function App() {
  return (
    <NavigationProvider>
      <Router />
    </NavigationProvider>
  )
}
```

## Arquivos críticos

### Novos
- [apps/web/src/components/atoms/icons/ArrowForwardIcon.tsx](apps/web/src/components/atoms/icons/ArrowForwardIcon.tsx)
- [apps/web/src/components/atoms/icons/LoginIcon.tsx](apps/web/src/components/atoms/icons/LoginIcon.tsx)
- [apps/web/src/contexts/NavigationContext.tsx](apps/web/src/contexts/NavigationContext.tsx)
- [apps/web/src/components/organisms/CadastroForm.tsx](apps/web/src/components/organisms/CadastroForm.tsx)
- [apps/web/src/pages/CadastroPage.tsx](apps/web/src/pages/CadastroPage.tsx)

### Modificados (ajustes finos)
- [apps/web/index.html](apps/web/index.html) — fonte Prompt no lugar de Inter
- [apps/web/src/index.css](apps/web/src/index.css) — tokens alinhados ao Figma
- [apps/web/src/components/atoms/Input.tsx](apps/web/src/components/atoms/Input.tsx) — text-field-ink sobre fundo claro
- [apps/web/src/components/atoms/Button.tsx](apps/web/src/components/atoms/Button.tsx) — rounded-button (8px)
- [apps/web/src/components/atoms/Checkbox.tsx](apps/web/src/components/atoms/Checkbox.tsx) — validar contraste com tokens novos
- [apps/web/src/components/molecules/SocialLoginButton.tsx](apps/web/src/components/molecules/SocialLoginButton.tsx) — label "Gmail"
- [apps/web/src/components/organisms/LoginForm.tsx](apps/web/src/components/organisms/LoginForm.tsx) — ArrowForwardIcon + navigate via context
- [apps/web/src/App.tsx](apps/web/src/App.tsx) — NavigationProvider + Router

### Reuso direto (sem alteração)
- [apps/web/src/components/templates/AuthLayout.tsx](apps/web/src/components/templates/AuthLayout.tsx)
- [apps/web/src/components/organisms/AuthBanner.tsx](apps/web/src/components/organisms/AuthBanner.tsx)
- [apps/web/src/components/organisms/SocialLoginGroup.tsx](apps/web/src/components/organisms/SocialLoginGroup.tsx)
- [apps/web/src/components/molecules/FormField.tsx](apps/web/src/components/molecules/FormField.tsx)
- [apps/web/src/components/molecules/DividerWithText.tsx](apps/web/src/components/molecules/DividerWithText.tsx)
- [apps/web/src/components/atoms/TextLink.tsx](apps/web/src/components/atoms/TextLink.tsx)
- [apps/web/src/components/atoms/Divider.tsx](apps/web/src/components/atoms/Divider.tsx)
- [apps/web/src/components/atoms/ChainDecorations.tsx](apps/web/src/components/atoms/ChainDecorations.tsx)
- [apps/web/src/components/atoms/Label.tsx](apps/web/src/components/atoms/Label.tsx)

## Verification

1. **Build e tipos**
   - `pnpm --filter web type-check` → 0 erros
   - `pnpm --filter web build` → build limpo

2. **Comportamento (manual no dev server)**
   - `pnpm dev:web` → abre `http://localhost:5173`
   - **Login** renderiza com fonte Prompt + brand `#81FE88` + card `#171D1F` (regressão visual leve esperada — alinha à fonte Figma)
   - Clicar **"Crie seu cadastro!"** → muda para Cadastro (sem mudança de URL)
   - **Cadastro** exibe: banner + título "Cadastro" + subtítulo "Olá! Preencha seus dados." + 3 inputs + checkbox "Lembrar-me" + botão Cadastrar com seta + divider + Github/Gmail + rodapé "Já tem conta? Faça seu login!"
   - Clicar **"Faça seu login!"** → volta para Login
   - **Submit Cadastro vazio** → erros inline aparecem (Nome, Email inválido, Senha < 6)
   - **Submit Cadastro válido** → `onSubmit` dispara (no-op com TODO comment, sem rede ainda)

3. **Paridade visual com Figma**
   - Comparar contra screenshot Figma `155:3425` (mobile portrait): tipografia, cores, espaçamentos, ícones
   - Verificar que `bg-field` claro (#888) com texto escuro fica legível e bate com o Figma
   - Confirmar que o ícone arrow_forward aparece com cor `#132E35` no botão e ícone login aparece com `#81FE88` no link de rodapé

4. **Acessibilidade**
   - Tab order: Nome → Email → Senha → Lembrar-me → Cadastrar → Github → Gmail → Faça seu login
   - Erros de validação têm `role="alert"` e `aria-describedby` (via FormField existente)
   - Botões/links com aria-label apropriados onde só houver ícone

5. **Confirmar regras CodeConnect**
   - Commit em `Features` (nunca em `main`) com mensagem `feat(web): página de Cadastro + alinhamento de tokens ao Figma`
   - Sem novas dependências instaladas
   - Sem `style={{}}` inline; só Tailwind utilities

## Notas de decisão

- **Label "Gmail"**: matemos o `provider: 'google'` internamente (OAuth ainda é Google); só o label visível muda. Caso prefira "Google" por clareza de marca/UX, é trivial reverter no `SocialLoginButton`.
- **Lembrar-me no Cadastro**: usa `Checkbox` atom direto, não a molecule `RememberMeRow` (que inclui "Esqueci a senha" — não existe no Cadastro do Figma).
- **NavigationContext** está pensado para crescer: adicionar `'esqueci-senha'` no union `AuthPage` quando aquela página vier.
- **Tokens compartilhados**: o alinhamento ao Figma afeta a Login. Isso é intencional ("ajustes finos" pedidos). A Login fica visualmente alinhada, sem regressão funcional.
