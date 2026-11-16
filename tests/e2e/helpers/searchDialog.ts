import { expect, type Locator, type Page } from '@playwright/test';

export const SEARCH_DIALOG_NAME = '記事検索';

// 待たずに操作しない。/ の listener は effect で登録されるので、load の直後に押すと開かない。
// 操作を toPass でやり直さない。hydration の直後の 1 回目が効かない退行を、2 回目で通して隠すため。
// window.__NEXT_HYDRATED は Next のテストモードだけで立つので、Header の Layout が effect のあとに立てる data-is-mounted を待つ
export async function openSearchDialogWith(page: Page, operate: () => Promise<void>) {
  await expect(page.locator('header[data-is-mounted="true"]')).toBeAttached();
  await operate();

  const dialog = page.getByRole('dialog', { name: SEARCH_DIALOG_NAME });
  await expect(dialog).toBeVisible();

  return dialog;
}

export function openSearchDialogByTrigger(page: Page) {
  return openSearchDialogWith(page, () => page.getByRole('button', { name: SEARCH_DIALOG_NAME }).click());
}

export function getSearchInput(dialog: Locator) {
  return dialog.getByRole('combobox', { name: '検索キーワード' });
}
