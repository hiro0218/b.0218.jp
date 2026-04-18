import { expect, test } from '@playwright/test';
import { loadStoryIds } from './helpers/load-stories';
import { prepareStory } from './helpers/prepare-story';

const storyIds = loadStoryIds();

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    const FixedEpoch = new Date('2024-01-01T00:00:00+09:00').getTime();
    Date.now = () => FixedEpoch;
  });
});

for (const storyId of storyIds) {
  test(storyId, async ({ page }) => {
    await page.goto(`/iframe.html?id=${storyId}&viewMode=story`);
    await prepareStory(page);
    await expect(page).toHaveScreenshot(`${storyId}.png`, { fullPage: true });
  });
}
