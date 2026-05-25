# Cadastro v2 + Login alinhamento ao novo Figma — `apps/web`

> **Nota de localização (feedback memorizado):** o usuário pediu para planos
> ficarem em `CodeConnect/plans/`. Após aprovação, copio este conteúdo para
> `c:\Sheild\Projetos\Claude\Alura\CodeConnect\plans\cadastro-page-v2.md` e
> mantenho este arquivo apenas como ponteiro.

## Context

A sessão anterior implementou a Cadastro com base em um arquivo Figma
diferente (`BakVoeQ85l1EH5gDWWmiYF`). O usuário agora aponta para o arquivo
oficial (`XCrIvhaREUIq5LnBwjTSia`) com dois nodes:

- Login: `155:3800` — usado como referência visual para a página já existente
- Cadastro: `155:3484` — referência para a página implementada na sessão anterior

A **arquitetura está toda no lugar** (atoms · molecules · organisms · template ·
NavigationContext · ícones · paleta CodeConnect em `@theme`). O que muda é
apenas **alinhamento visual** de tipografia, padding do card, estilo do
"Esqueci a senha" no Login e ícone do link "Crie seu cadastro!".

Cinco ajustes finos + 1 atom novo (AssignmentIcon). Tudo respeita as regras
do `apps/nextjs/CLAUDE.md` (tokens semânticos, sem `text-[NNpx]`, sem
`[#xxxxxx]`).

## Diferenças detectadas (Figma vs implementação atual)

| Aspecto | Figma | Implementação atual | Ajuste |
|---|---|---|---|
| Card outer width | 996px | `max-w-4xl` (896px) | `max-w-5xl` (1024px — +28px do Figma, é o token mais próximo) |
| Card padding | `px-[78px] py-[56px]` | sem padding no `<main>` | `md:px-20 md:py-14` no `<main>`; tirar `px-8 py-10` do form-slot |
| Card border (Cadastro) | `border-black` (provavelmente bug do Figma — Login usa Grafite) | `border-card-border` (Grafite) | manter Grafite — único consistente entre as duas páginas |
| h1 título | 31px Prompt SemiBold | `text-2xl` (24px) | `text-3xl` (30px — token mais próximo) |
| subtítulo Login | 22px Prompt Regular | `text-base` (16px) | `text-xl` (20px — token mais próximo) |
| subtítulo Cadastro | 22px Prompt Regular | `text-xl` (20px) ✓ | sem mudança |
| Esqueci a senha (Login) | `#e1e1e1` 15px **sublinhado** | `text-brand` 14px sem sublinhado | `text-ink underline text-sm` |
| "Crie seu cadastro!" link | 18px verde + ícone Material `assignment` | 14px verde + emoji 📋 | `size="lg"` + `<AssignmentIcon />` |
| "Faça seu login!" link | 18px verde + ícone Material `login` | 14px verde + `<LoginIcon />` 5×5 | `size="lg"` (ícone já existe) |
| Footer Login | 2 linhas centralizadas (`Ainda não tem conta?` em cima, `Crie seu cadastro!` embaixo) | tudo em uma linha | quebrar em 2 `<p>` |
| Footer Cadastro | 1 linha alinhada à esquerda (`Já tem conta? Faça seu login!`) ✓ | 1 linha ✓ | apenas tamanho do link 18px |

## Approach

### 1. Novo atom — `AssignmentIcon.tsx`

`apps/web/src/components/atoms/icons/AssignmentIcon.tsx` — SVG inline do
Material `assignment`, mesmo padrão de `ArrowForwardIcon.tsx` e `LoginIcon.tsx`.

Path do ícone Material assignment (24×24):
```
M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14
c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1
s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z
```

### 2. Atom `TextLink.tsx` — adicionar prop `size`

Hoje é fixo em `text-sm`. Adicionar:

```tsx
type Size = 'sm' | 'lg'

type TextLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  underline?: boolean
  size?: Size               // novo — default 'sm'
  children: ReactNode
}

const sizeClasses: Record<Size, string> = {
  sm: 'text-sm',   // 14px ≈ Figma 15px
  lg: 'text-lg',   // 18px exato
}
```

Aplicar `${sizeClasses[size]}` no className. Default `'sm'` mantém retrocompat
para todos os usos atuais.

### 3. Molecule `RememberMeRow.tsx` — ajustar "Esqueci a senha"

O TextLink usado deve receber:
- sem variante de cor brand — usar `text-ink underline`
- mantém tamanho default `sm`

Editar o JSX do RememberMeRow para passar `className="text-ink underline"` ao
TextLink que renderiza o forgot link. (O atom TextLink hoje usa `text-brand`
hardcoded — vou ajustar o atom para permitir override via className, OU
adicionar uma variant `tone`. Mais simples: parametrizar via className do
consumidor — `className` já é forwarded e Tailwind merge não está no projeto,
então o className passado vence sobre o default.)

Atenção: se `text-brand` vs `text-ink` não der merge correto (Tailwind v4 sem
tailwind-merge), refatoro TextLink para ter prop `tone?: 'brand' | 'ink'`.

### 4. Template `AuthLayout.tsx` — padding e width

```tsx
<main className="relative z-10 w-full max-w-5xl bg-card border border-card-border rounded-card shadow-card overflow-hidden grid grid-cols-1 md:grid-cols-2 md:px-20 md:py-14 md:gap-6">
  <div className="h-52 md:h-auto md:overflow-hidden md:rounded-card">
    {banner}
  </div>
  <div className="flex flex-col justify-center px-8 py-10 md:px-0 md:py-0">
    {form}
  </div>
</main>
```

Mudanças:
- `max-w-4xl` → `max-w-5xl`
- Adiciona `md:px-20 md:py-14` no `<main>` (78px≈80px / 56px exato)
- Adiciona `md:gap-6` entre banner e form (≈24px ≈ Figma 23px)
- Form-slot zera padding em md+ (já vem do main agora)
- Banner-slot ganha `md:overflow-hidden md:rounded-card` para a imagem
  respeitar o radius do card quando ela perde o `overflow-hidden` do main

### 5. Organism `LoginForm.tsx`

```tsx
<h1 className="text-3xl font-semibold text-ink mb-1">Login</h1>
<p className="text-xl text-ink mb-6">Boas-vindas! Faça seu login.</p>

// ... (form fields, button) ...

<div className="mt-6 space-y-4">
  <DividerWithText>ou entre com outras contas</DividerWithText>
  <SocialLoginGroup />
  <div className="space-y-2">
    <p className="text-center text-sm text-ink">Ainda não tem conta?</p>
    <p className="text-center">
      <TextLink
        href="#"
        onClick={handleGoToCadastro}
        size="lg"
        className="inline-flex items-center gap-3"
      >
        Crie seu cadastro! <AssignmentIcon className="w-6 h-6" />
      </TextLink>
    </p>
  </div>
</div>
```

### 6. Organism `CadastroForm.tsx`

```tsx
<h1 className="text-3xl font-semibold text-ink mb-2">Cadastro</h1>
// subtítulo já é text-xl ✓

// ... (form fields, button) ...

// Footer "Já tem conta? Faça seu login!" — usar size="lg" no TextLink:
<p className="flex items-center gap-2 text-lg text-ink">
  Já tem conta?{' '}
  <TextLink
    href="#"
    onClick={handleGoToLogin}
    size="lg"
    className="inline-flex items-center gap-1.5"
  >
    Faça seu login! <LoginIcon className="w-5 h-5" />
  </TextLink>
</p>
```

Mudanças vs atual:
- `h1` `text-2xl` → `text-3xl`
- footer prefix `text-base` → `text-lg`
- TextLink ganha `size="lg"`

### 7. Imagem do banner

O Figma usa duas imagens diferentes (Login: `5338c3a6-…`, Cadastro:
`90fcb21a-…`). O projeto atual tem só `/IMG2_Tablet.png`.

**Decisão:** manter `/IMG2_Tablet.png` para ambas — não é regressão em relação
ao que já está em produção, e trocar imagens é trivial depois (basta baixar
as duas e atualizar `imageSrc` nas pages). Anoto isso como follow-up
opcional na verificação.

## Arquivos modificados (todos em `apps/web/src/`)

### Novos
- [components/atoms/icons/AssignmentIcon.tsx](apps/web/src/components/atoms/icons/AssignmentIcon.tsx)

### Modificados (ajustes finos)
- [components/atoms/TextLink.tsx](apps/web/src/components/atoms/TextLink.tsx) — prop `size`
- [components/molecules/RememberMeRow.tsx](apps/web/src/components/molecules/RememberMeRow.tsx) — esqueci-senha offwhite+underline
- [components/templates/AuthLayout.tsx](apps/web/src/components/templates/AuthLayout.tsx) — `max-w-5xl` + `md:px-20 md:py-14`
- [components/organisms/LoginForm.tsx](apps/web/src/components/organisms/LoginForm.tsx) — h1, subtitle, footer 2 linhas, AssignmentIcon
- [components/organisms/CadastroForm.tsx](apps/web/src/components/organisms/CadastroForm.tsx) — h1, footer com `size="lg"`

### Reuso direto (sem alteração)
Input, Button, Label, Checkbox, Divider, ChainDecorations, ArrowForwardIcon,
LoginIcon, FormField, DividerWithText, SocialLoginButton, AuthBanner,
SocialLoginGroup, LoginPage, CadastroPage, NavigationContext, App.tsx,
index.css, index.html.

## Verification

1. **Tipos e build**
   - `pnpm --filter web type-check` → 0 erros
   - `pnpm --filter web build` → build limpo

2. **Dev server**
   - `pnpm dev:web` → http://localhost:5173
   - HMR aplica as mudanças sem reload

3. **Comparação visual com Figma**
   - Abrir Figma Login (`155:3800`) lado a lado com `localhost:5173` (Login)
     - Card mais largo, mais respiração interna
     - Título maior ("Login" em 30px vs 24px)
     - Subtítulo mais legível ("Boas-vindas..." em 20px vs 16px)
     - "Esqueci a senha" offwhite com sublinhado
     - Footer: "Ainda não tem conta?" centralizada + "Crie seu cadastro! 📋" abaixo (com ícone clipboard)
   - Clicar "Crie seu cadastro!" → Cadastro
   - Abrir Figma Cadastro (`155:3484`) lado a lado com `localhost:5173`
     - Mesmo card largo
     - "Cadastro" em 30px
     - Link "Faça seu login!" agora em 18px (era 14px)
     - Ícone login mantido
   - Voltar via "Faça seu login!"

4. **Mobile (~375px)**
   - Stack vertical mantido (banner em cima, form embaixo)
   - Padding mobile menor (`px-8 py-10` apenas no form-slot, sem `md:px-20`)
   - Sem horizontal overflow

5. **A11y**
   - Tab order não regrediu
   - "Esqueci a senha" continua focável e tem visual de link (sublinhado)
   - Ícones decorativos têm `aria-hidden="true"` (já feito nos atoms)

6. **Follow-up opcional (não bloqueia merge)**
   - Baixar `imgRectangle1726` dos dois nodes Figma e salvar como
     `/IMG2_Login_Desktop.png` + `/IMG2_Cadastro_Desktop.png`
     (para diferenciar visualmente as duas páginas — hoje ambas usam a
     mesma imagem).

## Pontos de decisão escondidos no plano

1. **TextLink — `tone` ou `className`?** Começo testando override por
   className (mais leve). Se Tailwind v4 sem `tailwind-merge` não fizer o
   merge corretamente entre `text-brand` (default) e `text-ink` (consumidor),
   adiciono prop `tone?: 'brand' | 'ink'` no atom. Decido durante
   implementação ao ver o DOM.

2. **Border do card no Cadastro Figma — black vs grafite.** Figma mostra
   `border-black` no Cadastro e `border-[#00090e]` no Login. Tratando como
   inconsistência do Figma, uso Grafite (`--color-card-border`) nos dois —
   consistência interna vence imitação literal.

3. **`max-w-5xl` (1024px) é 28px maior que o Figma (996px).** Aceitar a
   diferença para usar token Tailwind padrão, conforme regra recém-adicionada
   ao `apps/nextjs/CLAUDE.md` (não usar arbitrary values).
