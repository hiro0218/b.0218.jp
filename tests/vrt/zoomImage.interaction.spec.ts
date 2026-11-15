import { expect, type Locator, type Page, test } from '@playwright/test';

const STORY_URL = '/iframe.html?id=ui-zoomimage--default&viewMode=story';
const ALT = 'TypeScript の型推論フロー図';

// body を違反にしない。モーダルの外へ焦点が出ると、ブラウザの UI へ移り、文書の焦点は body になるため
const FOCUS_OUTSIDE_DIALOG = ':focus:not(body, dialog[open], dialog[open] *)';

function getTrigger(page: Page) {
  return page.getByRole('button', { name: ALT });
}

async function openDialog(page: Page) {
  await page.goto(STORY_URL);
  await getTrigger(page).click();

  const dialog = page.getByRole('dialog', { name: ALT });
  await expect(dialog).toBeVisible();
  // 表示の確認だけで次の操作へ進まない。開く遷移の最中の閉じる操作は無視される(useImageZoom の isTransitioning)ため、遷移が名前を外すまで待つ
  await expect(dialog.locator('img')).toHaveCSS('view-transition-name', 'none');

  return dialog;
}

const closers: [label: string, close: (page: Page, dialog: Locator) => Promise<void>][] = [
  ['Esc を押した', (page) => page.keyboard.press('Escape')],
  ['背景を押した', (page) => page.mouse.click(5, 5)],
  ['画像(閉じるボタン)を押した', (_page, dialog) => dialog.getByRole('button', { name: '閉じる' }).click()],
];

test('トリガーを押した場合、dialog を開き、トリガーの aria-expanded を true にする', async ({ page }) => {
  await openDialog(page);

  await expect(getTrigger(page)).toHaveAttribute('aria-expanded', 'true');
});

for (const [label, close] of closers) {
  test(`dialog を開いて、${label}場合、dialog を閉じ、トリガーの aria-expanded を false に戻す`, async ({ page }) => {
    const dialog = await openDialog(page);

    await close(page, dialog);

    await expect(dialog).toBeHidden();
    await expect(getTrigger(page)).toHaveAttribute('aria-expanded', 'false');
  });

  test(`dialog を開いて、${label}場合、焦点をトリガーに戻す`, async ({ page }) => {
    const dialog = await openDialog(page);

    await close(page, dialog);

    await expect(dialog).toBeHidden();
    await expect(getTrigger(page)).toBeFocused();
  });
}

test('dialog を開いた直後に Enter を押した場合、dialog を閉じる', async ({ page }) => {
  const dialog = await openDialog(page);

  await page.keyboard.press('Enter');

  await expect(dialog).toBeHidden();
});

test('Tab を繰り返し押した場合も、焦点は dialog の外へ出ない', async ({ page }) => {
  await openDialog(page);
  // 外側のボタンを足す。ストーリーの外側には焦点を取れる要素が無く、dialog が焦点を取り込まなくても通ってしまうため
  await page.evaluate(() =>
    document.body.insertAdjacentHTML('beforeend', '<button type="button">外側のボタン</button>'),
  );

  for (let count = 0; count < 4; count += 1) {
    await page.keyboard.press('Tab');
    await expect(page.locator(FOCUS_OUTSIDE_DIALOG)).toHaveCount(0);
  }
});

// 背面のスクロール止めは、dialog 側ではなく base/index.css の body:has(dialog[open]) が担う
test('dialog を開いている間、背面のページをスクロールさせない', async ({ page }) => {
  await openDialog(page);

  await expect(page.locator('body')).toHaveCSS('overflow', 'clip');
});

// 開く遷移は 0.3 秒ほどで終わるため、遷移の準備ができた時点で記録する
test('動きを減らす設定で開く場合、画像の移動のアニメーションを動かさない', async ({ page }) => {
  await page.addInitScript(() => {
    const durations: number[] = [];
    Object.assign(window, { zoomImageDurations: durations });
    const startViewTransition = document.startViewTransition.bind(document);
    document.startViewTransition = (callback) => {
      const transition = startViewTransition(callback);
      transition.ready.then(
        () => {
          for (const animation of document.getAnimations()) {
            const effect = animation.effect as KeyframeEffect | null;
            if (effect?.pseudoElement?.includes('zoom-image')) {
              durations.push(Number(effect.getComputedTiming().duration));
            }
          }
        },
        () => {},
      );
      return transition;
    };
  });
  await openDialog(page);

  const durations = await page.evaluate(
    () => (window as unknown as { zoomImageDurations: number[] }).zoomImageDurations,
  );

  // 記録が空のまま通さない。確かめたことにならないため
  expect(durations.length).toBeGreaterThan(0);
  expect(durations.filter((duration) => duration !== 0)).toEqual([]);
});
