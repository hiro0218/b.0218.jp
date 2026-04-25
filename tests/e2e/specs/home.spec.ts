import { expect, test } from '@playwright/test';

test('home page renders main and post links', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('main')).toBeVisible();

  const postLinks = page.locator('main a[href$=".html"]');
  await expect(postLinks.first()).toBeVisible();
  await expect(postLinks).not.toHaveCount(0);
});
