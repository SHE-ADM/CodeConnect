import { test, expect } from '@playwright/test';
import { runAxe, logSummary, formatViolations, formatIncomplete } from './helpers';

async function gotoCadastro(page: import('@playwright/test').Page) {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Login', level: 1 })).toBeVisible();
  await page.getByRole('link', { name: /crie seu cadastro/i }).click();
  await expect(page.getByRole('heading', { name: 'Cadastro', level: 1 })).toBeVisible();
}

test.describe('CadastroPage — WCAG 2.1 AA', () => {
  test('estado inicial — não deve ter violações automatizadas detectáveis', async ({ page }) => {
    await gotoCadastro(page);

    const results = await runAxe(page);
    logSummary('CadastroPage [initial]', results);

    if (results.incomplete.length) {
      // eslint-disable-next-line no-console
      console.log(`\n[a11y] CadastroPage [initial] — incomplete (revisão manual):\n${formatIncomplete(results.incomplete)}`);
    }

    const summary = results.violations.map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.length }));
    expect.soft(summary, `\n${formatViolations(results.violations)}\n`).toEqual([]);
  });

  test('estado com erros de validação — não deve ter violações automatizadas detectáveis', async ({ page }) => {
    await gotoCadastro(page);

    // Submete o formulário vazio para disparar as três mensagens de erro.
    await page.getByRole('button', { name: /^Cadastrar/ }).click();

    await expect(page.getByText('Informe seu nome.')).toBeVisible();
    await expect(page.getByText('E-mail inválido.')).toBeVisible();
    await expect(page.getByText('Senha deve ter ao menos 6 caracteres.')).toBeVisible();

    const results = await runAxe(page);
    logSummary('CadastroPage [errors]', results);

    if (results.incomplete.length) {
      // eslint-disable-next-line no-console
      console.log(`\n[a11y] CadastroPage [errors] — incomplete (revisão manual):\n${formatIncomplete(results.incomplete)}`);
    }

    const summary = results.violations.map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.length }));
    expect.soft(summary, `\n${formatViolations(results.violations)}\n`).toEqual([]);
  });
});
