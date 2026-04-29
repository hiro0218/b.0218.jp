import { expect, test } from '@playwright/test';

const POST_HREF = /^\/.+\.html$/;
const POST_URL = /\.html$/;

test('archive page leads to a post detail', async ({ page }) => {
  await page.goto('/archive');

  const main = page.getByRole('main');
  await expect(main).toBeVisible();

  const firstPostLink = main.getByRole('list').first().getByRole('link').first();
  await expect(firstPostLink).toBeVisible();
  await expect(firstPostLink).toHaveAttribute('href', POST_HREF);

  await firstPostLink.click();

  await expect(page).toHaveURL(POST_URL);
  const postMain = page.getByRole('main');
  await expect(postMain).toBeVisible();
  await expect(postMain.getByRole('heading', { level: 1 })).toBeVisible();
});
