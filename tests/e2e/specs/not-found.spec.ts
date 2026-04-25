import { expect, test } from '@playwright/test';

test('unknown URL renders 404 not-found content', async ({ page }) => {
  const response = await page.goto('/__definitely_not_a_page__');

  expect(response?.status()).toBe(404);
  await expect(page.getByRole('heading', { level: 1, name: '404' })).toBeVisible();
  await expect(page.getByText('お探しのページは見つかりませんでした')).toBeVisible();
});
