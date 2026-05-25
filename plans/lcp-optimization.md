# Otimizar LCP (1.7s → meta < 1.2s) — `apps/web`

> **Nota de localização (feedback memorizado):** o usuário pediu para planos
> ficarem em `CodeConnect/plans/`. Após aprovação, copio este conteúdo para
> `c:\Sheild\Projetos\Claude\Alura\CodeConnect\plans\lcp-optimization.md`.

## Context

Lighthouse rodado em `localhost:5173` (dev server) reportou LCP de **1.7s**
(score 0.72 — zona amarela). FCP 1.1s e Speed Index 1.1s já estão na zona
verde, então o trabalho é cirurgicamente no LCP.

O **LCP element é a imagem do banner** (`/IMG2_Tablet.png`, 267 KB) renderizada
pelo organism `AuthBanner` no AuthLayout — o maior elemento visível na primeira
pintura, tanto no Login quanto no Cadastro. Auditando o código achei 3 causas
diretas que somam o atraso:

1. **`loading="lazy"` na imagem LCP** ([apps/web/src/components/organisms/AuthBanner.tsx:14](apps/web/src/components/organisms/AuthBanner.tsx#L14)) — o atributo mais hostil possível ao LCP. Lazy só faz sentido para imagens abaixo da dobra; banner de auth é sempre topo.
2. **Sem `<link rel="preload">` da imagem no `<head>`** — o browser só descobre a imagem depois de parsear o JS bundle e o React renderizar. Quebra a janela de descoberta inicial.
3. **Sem `fetchpriority="high"`** — mesmo com eager, o browser dá prioridade média a `<img>`. Para o LCP element, queremos prioridade explícita alta.

Dois fatores menores que entram no follow-up (não são bloqueadores):
- PNG não comprimido (267 KB) — converter para WebP/AVIF reduz 50–70%.
- Lighthouse foi medido no Vite dev server (com HMR e JIT). Production build com Vite preview daria números bem melhores sem código novo, mas isso é orientação de medição, não código.

## Approach

### 1. `AuthBanner.tsx` — virar a flag de priority

Substituir os atributos atuais por configuração otimizada para LCP:

```tsx
// apps/web/src/components/organisms/AuthBanner.tsx
<img
  src={imageSrc}
  alt={imageAlt}
  width={1920}
  height={1080}
  loading="eager"           // era "lazy" — não fazer lazy de LCP
  fetchPriority="high"      // sinalizar prioridade alta ao browser
  decoding="async"          // mantém
  className="absolute inset-0 w-full h-full object-cover"
/>
```

React converte `fetchPriority` para o atributo HTML `fetchpriority`. Disponível desde React 18.3 / Chromium 102+ / Firefox 132+. Browsers antigos ignoram graciosamente.

### 2. `index.html` — preload da imagem do banner

Adicionar no `<head>` (depois dos preconnects de fontes):

```html
<link
  rel="preload"
  as="image"
  href="/IMG2_Tablet.png"
  fetchpriority="high"
/>
```

Efeito: o browser inicia o download do PNG enquanto ainda parseia HTML, antes de qualquer JS. Tipicamente corta 300–600 ms do LCP em conexões 3G/4G.

### 3. (Opcional, dentro do mesmo PR) — converter PNG para WebP

Comprimir `public/IMG2_Tablet.png` (267 KB) para `IMG2_Tablet.webp` (~70–100 KB esperado) e atualizar:
- `apps/web/index.html` — `href="/IMG2_Tablet.webp"` no preload
- `apps/web/src/pages/LoginPage.tsx` — `imageSrc="/IMG2_Tablet.webp"`
- `apps/web/src/pages/CadastroPage.tsx` — `imageSrc="/IMG2_Tablet.webp"`

Aceito ficar como follow-up se você preferir não tocar em assets agora. WebP tem 96.5% de browser support — não precisa fallback PNG.

## Arquivos modificados

### Modificados (cirúrgico)
- [apps/web/src/components/organisms/AuthBanner.tsx](apps/web/src/components/organisms/AuthBanner.tsx) — `loading="eager"` + `fetchPriority="high"`
- [apps/web/index.html](apps/web/index.html) — `<link rel="preload" as="image" ...>`

### Não modificados
Toda a paleta `@theme`, todos os outros componentes, NavigationContext, etc. Esta otimização é isolada à entrega da imagem LCP.

## Verification

1. **Build de produção** (não medir em dev — Vite tem overhead JIT):
   ```powershell
   pnpm --filter web build
   pnpm --filter web preview        # serve em http://localhost:4173
   ```

2. **Lighthouse no preview (não no dev)**:
   - Chrome DevTools → Lighthouse → Performance + Best Practices
   - Modo: Navigation
   - Device: Desktop
   - Comparar:
     - LCP antes: 1.7s
     - LCP esperado depois: < 1.2s (score 1.0)

3. **DevTools Network**:
   - Reload com cache desabilitado
   - Confirmar que `IMG2_Tablet.png` aparece **antes** do bundle JS na timeline
   - Confirmar que tem prioridade "High" na coluna Priority

4. **Performance panel**:
   - Aba Performance → record reload
   - LCP marker deve apontar para o `<img>` do banner
   - Tempo do LCP marker — comparar antes/depois

5. **Regressão visual** — não deve ter. As mudanças são só metadados de fetch.

## Pontos de decisão escondidos no plano

1. **`width={1920} height={1080}` no AuthBanner não bate com aspect ratio real** do PNG nem do container Figma (banner é 407×675, ~3:5). Como o container tem altura fixa (`h-52` mobile / `md:h-auto` desktop) e a imagem usa `object-cover`, isso não causa CLS visível. Mantenho os valores por enquanto — corrigir junto com a conversão para WebP no follow-up.

2. **WebP fica no follow-up** se você quiser merge incremental. As mudanças (1) e (2) já entregam a maior parte do ganho — preload + fetchpriority sozinhos devem trazer LCP para < 1.3s.

3. **Não vou mexer no Vite config** (rollupOptions, asset inlining, etc.) — o ganho marginal não compensa a complexidade. Preload + fetchpriority + eager cobrem 90% do que importa para LCP de uma SPA.
