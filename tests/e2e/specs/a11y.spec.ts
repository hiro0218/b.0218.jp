import { expect, type Locator, type Page, test } from '@playwright/test';
import axe from 'axe-core';
import { getSearchInput, openSearchDialogByTrigger } from '../helpers/searchDialog';

// WCAG 2.2 AA を下限にする。best-practice は含めない。region など、このサイトの構造に合わない助言が混じるため
const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

const TAG_URL = /\/tags\/.+/;
const POST_URL = /\.html$/;

const ROUTES: [path: string, disabledRules?: string[]][] = [
  ['/'],
  ['/archive'],
  ['/tags'],
  ['/popular'],
  ['/about'],
  ['/privacy'],
  ['/__definitely_not_a_page__'],
];

// disabledRules には、直せていない既知の違反のルール ID だけを渡す。ページ全体の除外には使わない
async function expectNoWcagViolations(page: Page, disabledRules: string[] = []) {
  await page.addScriptTag({ content: axe.source });

  const { violations } = await page.evaluate(
    ({ tags, disabled }) =>
      (window as unknown as { axe: typeof axe }).axe.run(document, {
        runOnly: { type: 'tag', values: tags },
        // 全種別の結果を返さない。使わない passes などの全ノードの変換と転送の分、検査が遅くなるため
        resultTypes: ['violations'],
        rules: Object.fromEntries(disabled.map((id) => [id, { enabled: false }])),
      }),
    { tags: WCAG_TAGS, disabled: disabledRules },
  );

  // 違反を件数で比べない。ルール ID と対象で比べると、失敗時のメッセージだけで原因の箇所を読める
  expect(violations.map(({ id, nodes }) => ({ id, targets: nodes.map(({ target }) => target.join(' ')) }))).toEqual([]);
}

// 開く動きが終わってから検査する。動きの途中の opacity で、色のコントラストの計算がぶれる
async function waitForAnimationsToFinish(dialog: Locator) {
  await expect.poll(() => dialog.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
}

for (const [path, disabledRules] of ROUTES) {
  test(`${path} を開いた場合、WCAG の自動検査で違反を検出しない`, async ({ page }) => {
    await page.goto(path);
    await expect(page.getByRole('main')).toBeVisible();

    await expectNoWcagViolations(page, disabledRules);
  });
}

test('タグの記事一覧を開いた場合、WCAG の自動検査で違反を検出しない', async ({ page }) => {
  await page.goto('/tags');
  await page.getByRole('main').getByRole('link').first().click();
  await expect(page).toHaveURL(TAG_URL);
  await expect(page.getByRole('main')).toBeVisible();

  await expectNoWcagViolations(page);
});

// 記事本文を除外しない。本文を包む要素が無く、除外する選択子を作れないため
test('記事ページを開いた場合、WCAG の自動検査で違反を検出しない', async ({ page }) => {
  await page.goto('/archive');
  await page.getByRole('main').locator('a[href$=".html"]').first().click();
  await expect(page).toHaveURL(POST_URL);
  await expect(page.getByRole('main').getByRole('heading', { level: 1 })).toBeVisible();

  await expectNoWcagViolations(page);
});

test('検索ダイアログを開いた場合、WCAG の自動検査で違反を検出しない', async ({ page }) => {
  await page.goto('/');
  const dialog = await openSearchDialogByTrigger(page);
  await waitForAnimationsToFinish(dialog);

  await expectNoWcagViolations(page);
});

test('検索語を入力して結果が出た場合も、WCAG の自動検査で違反を検出しない', async ({ page }) => {
  await page.goto('/');
  const dialog = await openSearchDialogByTrigger(page);
  await getSearchInput(dialog).fill('CSS');
  await expect(dialog.getByRole('status')).toContainText('件の検索結果');
  await waitForAnimationsToFinish(dialog);

  await expectNoWcagViolations(page);
});
