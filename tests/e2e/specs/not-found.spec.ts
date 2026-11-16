import { expect, test } from '@playwright/test';

test('存在しない URL を開いた場合、404 の見出しと案内文を表示する', async ({ page }) => {
  const response = await page.goto('/__definitely_not_a_page__');

  expect(response?.status()).toBe(404);

  const main = page.getByRole('main');
  await expect(main.getByRole('heading', { level: 1, name: '404' })).toBeVisible();
  await expect(main.getByText('お探しのページは見つかりませんでした')).toBeVisible();
});
