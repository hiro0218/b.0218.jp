import { expect, test } from '@playwright/test';

test('unknown URL renders 404 not-found content', async ({ page }) => {
  const response = await page.goto('/__definitely_not_a_page__');

  expect(response?.status()).toBe(404);

  const main = page.getByRole('main');
  await expect(main.getByRole('heading', { level: 1, name: '404' })).toBeVisible();
  await expect(main.getByText('お探しのページは見つかりませんでした')).toBeVisible();
});
