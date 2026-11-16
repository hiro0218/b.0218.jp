import { expect, test } from '@playwright/test';

const POST_HREF = /\.html$/;

test('トップページを開いた場合、最新記事へのリンクを表示する', async ({ page }) => {
  await page.goto('/');

  const main = page.getByRole('main');
  await expect(main).toBeVisible();
  await expect(main.getByRole('heading', { name: '最新記事' })).toBeVisible();

  const firstPostLink = main.getByRole('list').first().getByRole('link').first();
  await expect(firstPostLink).toBeVisible();
  await expect(firstPostLink).toHaveAttribute('href', POST_HREF);
});
