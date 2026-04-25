import { expect, test } from '@playwright/test';

test('tags page lists tag links', async ({ page }) => {
  await page.goto('/tags');

  await expect(page.getByRole('main')).toBeVisible();

  const tagLinks = page.locator('main a[href^="/tags/"]');
  await expect(tagLinks).not.toHaveCount(0);
});
