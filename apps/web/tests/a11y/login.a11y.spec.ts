import { test, expect } from '@playwright/test';
import { runAxe, logSummary, formatViolations, formatIncomplete } from './helpers';

test.describe('LoginPage — WCAG 2.1 AA', () => {
  test('estado inicial — não deve ter violações automatizadas detectáveis', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Login', level: 1 })).toBeVisible();

    const results = await runAxe(page);
    logSummary('LoginPage [initial]', results);

    if (results.incomplete.length) {
      // eslint-disable-next-line no-console
      console.log(`\n[a11y] LoginPage [initial] — incomplete (revisão manual):\n${formatIncomplete(results.incomplete)}`);
    }

    const summary = results.violations.map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.length }));
    expect.soft(summary, `\n${formatViolations(results.violations)}\n`).toEqual([]);
  });

  test('estado com erros de validação — não deve ter violações automatizadas detectáveis', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Login', level: 1 })).toBeVisible();

    // Submete o formulário vazio para disparar as mensagens de erro.
    await page.getByRole('button', { name: /^Login/ }).click();

    // Aguarda as duas mensagens de erro aparecerem (role=alert).
    await expect(page.getByText('Informe seu email ou usuário.')).toBeVisible();
    await expect(page.getByText('Senha deve ter ao menos 6 caracteres.')).toBeVisible();

    const results = await runAxe(page);
    logSummary('LoginPage [errors]', results);

    if (results.incomplete.length) {
      // eslint-disable-next-line no-console
      console.log(`\n[a11y] LoginPage [errors] — incomplete (revisão manual):\n${formatIncomplete(results.incomplete)}`);
    }

    const summary = results.violations.map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.length }));
    expect.soft(summary, `\n${formatViolations(results.violations)}\n`).toEqual([]);
  });
});
