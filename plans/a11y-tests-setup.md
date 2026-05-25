# Plano — Testes Automatizados de Acessibilidade (WCAG 2.1 AA)

**App:** `apps/web` (React 19 + Vite 8 + Tailwind v4 + TS 6)
**Branch:** `Features`
**Objetivo inicial:** apenas **levantar problemas** — sem corrigir nada ainda.

---

## Decisões tomadas

| Item | Decisão | Motivo |
|---|---|---|
| Ferramenta | **Playwright + `@axe-core/playwright`** | E2E com CSS renderizado de verdade — único caminho confiável para detectar **1.4.3 Contrast (Minimum)**, critério crítico do AA |
| Browser | **Chromium apenas** | Suficiente para axe-core; Firefox/WebKit duplicariam tempo sem ganho de regras |
| Páginas | `LoginPage` e `CadastroPage` | Únicas rotas existentes hoje |
| Padrão WCAG | `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`, `best-practice` | AA = AA inclui A; `best-practice` ajuda a antecipar regressões |
| Estado de erro | Fora de escopo (fase 1) | Usuário pediu “inicialmente apenas os testes para levantar problemas” |

---

## Arquivos a criar / alterar

```
apps/web/
├── playwright.config.ts            ← NOVO
├── package.json                    ← scripts test:a11y, test:a11y:report, deps
└── tests/
    └── a11y/                       ← NOVO
        ├── helpers.ts              ← runAxe() com tags WCAG AA
        ├── login.a11y.spec.ts      ← varre LoginPage
        └── cadastro.a11y.spec.ts   ← navega via link e varre CadastroPage

package.json (raiz)                 ← script test:a11y:web
.gitignore (raiz)                   ← playwright-report/, test-results/, playwright/.cache/
```

---

## Etapas de execução

1. **Instalar dependências** em `apps/web`:
   ```powershell
   pnpm --filter web add -D @playwright/test @axe-core/playwright
   ```

2. **Instalar Chromium** do Playwright:
   ```powershell
   pnpm --filter web exec playwright install chromium
   ```

3. **Criar `playwright.config.ts`** com:
   - `webServer` auto-iniciando `pnpm dev` na porta 5173
   - `reporter: [['html', { outputFolder: 'playwright-report' }], ['list']]`
   - `projects: [{ name: 'chromium', use: devices['Desktop Chrome'] }]`
   - `testDir: './tests/a11y'`

4. **Criar `tests/a11y/helpers.ts`** exportando `runAxe(page)` com tags `wcag2a/aa/21a/21aa/best-practice`.

5. **Criar `tests/a11y/login.a11y.spec.ts`**:
   - Navega para `/`
   - Aguarda `h1:has-text("Login")`
   - Executa axe → falha o teste se houver violações

6. **Criar `tests/a11y/cadastro.a11y.spec.ts`**:
   - Navega para `/`
   - Clica no link “Crie seu cadastro!” (NavigationContext troca a página)
   - Aguarda `h1:has-text("Cadastre-se")` (ou heading correspondente)
   - Executa axe

7. **Adicionar scripts**:

   `apps/web/package.json`:
   ```json
   "test:a11y": "playwright test",
   "test:a11y:report": "playwright show-report"
   ```

   `package.json` (raiz):
   ```json
   "test:a11y:web": "pnpm --filter web test:a11y"
   ```

8. **Atualizar `.gitignore` (raiz)** com:
   ```
   playwright-report/
   test-results/
   playwright/.cache/
   ```

9. **Executar `pnpm test:a11y:web`** e gerar relatório consolidado de violações por critério WCAG.

---

## Critérios de aceitação

- [ ] `pnpm test:a11y:web` executa sem erros de configuração (testes podem falhar — é o esperado)
- [ ] Relatório HTML acessível via `pnpm --filter web test:a11y:report`
- [ ] Cada violação reportada inclui: critério WCAG, severidade (`minor` / `moderate` / `serious` / `critical`), seletor DOM afetado e link para documentação axe
- [ ] Lista priorizada de problemas entregue ao usuário (sem aplicar correções)

---

## Próximas fases (fora deste plano)

1. Corrigir violações por ordem de severidade
2. Adicionar testes Vitest + jest-axe para componentes isolados
3. Cobrir estados de formulário (erros de validação, foco)
4. Auditoria manual (teclado, leitor de tela) — automação não substitui isso
