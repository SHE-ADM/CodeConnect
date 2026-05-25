import AxeBuilder from '@axe-core/playwright';
import type { Page } from '@playwright/test';

const WCAG_AA_TAGS = [
  'wcag2a',
  'wcag2aa',
  'wcag21a',
  'wcag21aa',
  'best-practice',
] as const;

type AxeResults = Awaited<ReturnType<AxeBuilder['analyze']>>;

export async function runAxe(page: Page): Promise<AxeResults> {
  await page.waitForLoadState('networkidle');
  return new AxeBuilder({ page })
    .withTags([...WCAG_AA_TAGS])
    .analyze();
}

export function logSummary(label: string, results: AxeResults) {
  // eslint-disable-next-line no-console
  console.log(
    `\n[a11y] ${label}: ${results.violations.length} violations, ` +
      `${results.passes.length} passes, ` +
      `${results.incomplete.length} incomplete, ` +
      `${results.inapplicable.length} inapplicable`,
  );
}

export function formatViolations(violations: AxeResults['violations']) {
  if (!violations.length) return 'no violations';
  return violations
    .map((v) => {
      const tags = v.tags.filter((t) => t.startsWith('wcag')).join(', ');
      const nodes = v.nodes
        .map((n) => `      • ${n.target.join(' ')}`)
        .join('\n');
      return (
        `  - [${v.impact ?? 'unknown'}] ${v.id} — ${v.help}\n` +
        `    tags: ${tags}\n` +
        `    help: ${v.helpUrl}\n` +
        nodes
      );
    })
    .join('\n\n');
}

export function formatIncomplete(incomplete: AxeResults['incomplete']) {
  if (!incomplete.length) return 'no incomplete checks';
  return incomplete
    .map((v) => `  - ${v.id} — ${v.help} (${v.nodes.length} node(s))`)
    .join('\n');
}
