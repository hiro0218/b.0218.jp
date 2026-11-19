import { expect, type Locator, type Page, test } from '@playwright/test';
import {
  getSearchInput,
  openSearchDialogByTrigger,
  openSearchDialogWith,
  SEARCH_DIALOG_NAME,
} from '../helpers/searchDialog';

const POST_URL = /\.html$/;
const DIALOG_DESCRIPTION = '記事タイトルまたはタグから検索することができます';

// body を違反にしない。モーダルの外へ焦点が出ると、ブラウザの UI へ移り、文書の焦点は body になるため
const FOCUS_OUTSIDE_DIALOG = ':focus:not(body, dialog[open], dialog[open] *)';

test('検索ボタンを押した場合、検索ダイアログを開き、入力欄に焦点を置く', async ({ page }) => {
  await page.goto('/');

  const dialog = await openSearchDialogByTrigger(page);

  await expect(dialog).toHaveAccessibleDescription(DIALOG_DESCRIPTION);
  await expect(getSearchInput(dialog)).toBeFocused();
});

test('/ キーを押した場合、検索ダイアログを開き、入力欄に焦点を置く', async ({ page }) => {
  await page.goto('/');

  const dialog = await openSearchDialogWith(page, () => page.keyboard.press('/'));

  await expect(getSearchInput(dialog)).toBeFocused();
});

test('Esc を押した場合、検索ダイアログを閉じ、検索ボタンに焦点を戻す', async ({ page }) => {
  await page.goto('/');
  const dialog = await openSearchDialogByTrigger(page);

  await page.keyboard.press('Escape');

  await expect(dialog).toBeHidden();
  await expect(page.getByRole('button', { name: SEARCH_DIALOG_NAME })).toBeFocused();
});

// 入力欄の外の Esc は keydown が届かず、ブラウザの cancel で閉じる。cancel をブラウザの既定のままにすると、ダイアログだけが閉じて開閉の状態が残り、開き直せない
test('入力欄の外で Esc を押した場合も、検索ダイアログを閉じ、開き直せる', async ({ page }) => {
  await page.goto('/');
  const dialog = await openSearchDialogByTrigger(page);
  await dialog.getByRole('button', { name: '検索を閉じる' }).focus();

  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();

  await page.getByRole('button', { name: SEARCH_DIALOG_NAME }).click();
  await expect(dialog).toBeVisible();
});

// 高さを既定のままにしない。低い画面でだけ、showModal() の既定の焦点が入力欄でなくなりうる(SearchDialog.tsx の useLayoutEffect のコメント)
test('画面が低い場合も、検索ダイアログを開いたとき入力欄に焦点を置く', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 300 });
  await page.goto('/');

  const dialog = await openSearchDialogByTrigger(page);

  await expect(getSearchInput(dialog)).toBeFocused();
});

test('ダイアログの外(背景)を押した場合、検索ダイアログを閉じる', async ({ page }) => {
  await page.goto('/');
  const dialog = await openSearchDialogByTrigger(page);

  await page.mouse.click(5, 5);

  await expect(dialog).toBeHidden();
});

// 背面のスクロール止めは、ダイアログ側ではなく base/index.css の body:has(dialog[open]) が担う
test('検索ダイアログを開いている間、背面のページをスクロールさせない', async ({ page }) => {
  await page.goto('/');
  await openSearchDialogByTrigger(page);

  await expect(page.locator('body')).toHaveCSS('overflow', 'clip');
});

// 行を見える位置へ動かす処理は、CSS の scroll-padding・scroll-margin に頼り、jsdom のテストはスタブで通る
test('結果が一覧の高さを超える場合、End で選んだ行は、一覧の見える範囲に入る', async ({ page }) => {
  await page.goto('/');
  const dialog = await openSearchDialogByTrigger(page);
  await getSearchInput(dialog).fill('CSS');
  await expect(dialog.getByRole('status')).toContainText('件の検索結果');

  await page.keyboard.press('End');

  await expect(dialog.getByRole('option', { selected: true })).toBeInViewport({ ratio: 1 });
});

const paint = (option: Locator) => option.evaluate((element) => getComputedStyle(element).backgroundColor);

// 最近の検索の語を 2 件置いて開き、↓ で selectedIndex 番目まで進める。0・1 番目が語、2 番目からが記事の行
async function openWithSelection(page: Page, selectedIndex: number) {
  await page.addInitScript(() => localStorage.setItem('recent-searches', JSON.stringify(['css', 'react'])));
  await page.goto('/');
  const dialog = await openSearchDialogByTrigger(page);
  for (let count = 0; count <= selectedIndex; count += 1) await page.keyboard.press('ArrowDown');

  return { options: dialog.getByRole('option'), current: dialog.getByRole('option', { selected: true }) };
}

// 単体テストにしない。jsdom は Panda の CSS を読み込まず、色と transition を比べられないため。
// 語と行は色の決め方が別々なので、どちらも確かめる
for (const { kind, selectedIndex, hoveredIndex } of [
  { kind: '最近の検索の語', selectedIndex: 0, hoveredIndex: 1 },
  { kind: '候補の記事の行', selectedIndex: 2, hoveredIndex: 3 },
]) {
  test(`マウスを載せただけの${kind}と、選んでいる${kind}は、別の色で示す`, async ({ page }) => {
    const { options, current } = await openWithSelection(page, selectedIndex);
    const hovered = options.nth(hoveredIndex);

    await hovered.hover();

    expect(await paint(hovered)).not.toBe(await paint(current));
  });

  // 選んでいる語・行の色を、hover の色との勝ち負けに任せない。生成される CSS では hover が選択中に勝ち、マウスを載せた間だけ濃さが薄くなるため
  test(`選んでいる${kind}にマウスを載せた場合も、色は載せる前と変えない`, async ({ page }) => {
    const { current } = await openWithSelection(page, selectedIndex);
    const before = await paint(current);

    await current.hover();

    expect(await paint(current)).toBe(before);
  });

  // 選ばれていない語・行を transition: none にしない。マウスを載せただけの行が即座に染まり、サイトのほかの一覧と動きがそろわないため
  test(`選んでいる${kind}は色を即座に、マウスを載せただけの${kind}は一覧の行と同じ速さで切り替える`, async ({
    page,
  }) => {
    const { options, current } = await openWithSelection(page, selectedIndex);
    const hovered = options.nth(hoveredIndex);

    await hovered.hover();

    await expect(current).toHaveCSS('transition-duration', '0s');
    await expect(hovered).toHaveCSS('transition-duration', '0.1s');
  });
}

test('閉じるボタンを押した場合、検索ダイアログを閉じる', async ({ page }) => {
  await page.goto('/');
  const dialog = await openSearchDialogByTrigger(page);

  await dialog.getByRole('button', { name: '検索を閉じる' }).click();

  await expect(dialog).toBeHidden();
});

test('Tab を繰り返し押した場合も、焦点は検索ダイアログの外へ出ない', async ({ page }) => {
  await page.goto('/');
  await openSearchDialogByTrigger(page);

  // ダイアログの中の焦点を取れる要素より多く押し、一周させる
  for (let count = 0; count < 12; count += 1) {
    await page.keyboard.press('Tab');
    await expect(page.locator(FOCUS_OUTSIDE_DIALOG)).toHaveCount(0);
  }
});

test('Shift+Tab を繰り返し押した場合も、焦点は検索ダイアログの外へ出ない', async ({ page }) => {
  await page.goto('/');
  await openSearchDialogByTrigger(page);

  for (let count = 0; count < 12; count += 1) {
    await page.keyboard.press('Shift+Tab');
    await expect(page.locator(FOCUS_OUTSIDE_DIALOG)).toHaveCount(0);
  }
});

test('候補の記事を選んだ場合、記事へ移動し、検索ダイアログを閉じる', async ({ page }) => {
  await page.goto('/');
  const dialog = await openSearchDialogByTrigger(page);

  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');

  await expect(page).toHaveURL(POST_URL);
  await expect(dialog).toBeHidden();
});

// 設定の既定(reducedMotion: 'reduce')だけで確かめない。閉じる動きが fadeOut になり、zoomOut の終わりで閉じる経路を通らないため
test('動きを減らす設定が無い場合も、Esc を押すと検索ダイアログを閉じる', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  const dialog = await openSearchDialogByTrigger(page);

  await page.keyboard.press('Escape');

  await expect(dialog).toBeHidden();
  await expect(page.getByRole('button', { name: SEARCH_DIALOG_NAME })).toBeFocused();
});
