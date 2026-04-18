import type { Page } from '@playwright/test';

const DISABLE_MOTION_CSS = `
  *, *::before, *::after {
    animation-duration: 0s !important;
    animation-delay: 0s !important;
    transition-duration: 0s !important;
    transition-delay: 0s !important;
    caret-color: transparent !important;
    scroll-behavior: auto !important;
  }
`;

export async function prepareStory(page: Page): Promise<void> {
  await page.addStyleTag({ content: DISABLE_MOTION_CSS });
  await page.waitForLoadState('networkidle');
  await page.evaluate(() => document.fonts.ready);
}
