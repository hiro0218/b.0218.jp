import { expect, test } from '@playwright/test';

const TAG_HREF = /^\/tags\//;

test('タグ一覧を開いた場合、タグへのリンクを並べる', async ({ page }) => {
  await page.goto('/tags');

  const main = page.getByRole('main');
  await expect(main).toBeVisible();
  await expect(main.getByRole('heading', { level: 1, name: 'タグ' })).toBeVisible();

  const firstTagLink = main.getByRole('link').first();
  await expect(firstTagLink).toBeVisible();
  await expect(firstTagLink).toHaveAttribute('href', TAG_HREF);
});
