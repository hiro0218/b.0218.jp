import { expect, test } from '@playwright/test';

const STORY_URL = '/iframe.html?id=ui-tooltip--default&viewMode=story';

test('トリガーからツールチップへポインタを移した場合、ポインタの下にツールチップがあり、開いたままである', async ({
  page,
}) => {
  await page.goto(STORY_URL);
  const trigger = page.getByRole('button', { name: 'GitHub' });
  const triggerBox = await trigger.boundingBox();
  if (!triggerBox) throw new Error('トリガーの位置が取れない');

  // 1 回の移動で直接トリガーへ入らない。React Aria は、直前に pointermove を見たあとの hover だけを受け、直接入ると開かないため
  await page.mouse.move(triggerBox.x - 20, triggerBox.y - 20);
  await page.mouse.move(triggerBox.x + triggerBox.width / 2, triggerBox.y + triggerBox.height / 2, { steps: 5 });
  const tooltip = page.getByRole('tooltip');
  await expect(tooltip).toBeVisible();

  // 当たり判定を自前で書かない。hover() が、ポインタの下がツールチップでなければ失敗するため。pointer-events: none だと、ポインタは下の要素へ抜け、React Aria の「載っている間は開いたまま」が働かない
  await tooltip.hover();
  await expect(tooltip).toBeVisible();
});
