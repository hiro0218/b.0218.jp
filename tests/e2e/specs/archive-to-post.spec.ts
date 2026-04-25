import { expect, test } from '@playwright/test';

const POST_LINK_HREF = /^\/.+\.html$/;
const POST_URL = /\.html$/;

test('archive page leads to a post detail', async ({ page }) => {
  await page.goto('/archive');

  await expect(page.getByRole('main')).toBeVisible();

  const firstPostLink = page.locator('main a[href$=".html"]').first();
  await expect(firstPostLink).toBeVisible();

  const href = await firstPostLink.getAttribute('href');
  expect(href).toMatch(POST_LINK_HREF);

  await firstPostLink.click();
  await expect(page).toHaveURL(POST_URL);
  await expect(page.getByRole('main')).toBeVisible();
  await expect(page.locator('main h1').first()).toBeVisible();
});
