import { cwd } from 'node:process';

import chromium from '@sparticuz/chromium';
import type { Browser } from 'playwright-core';
// eslint-disable-next-line import-x/default
import playwright from 'playwright-core';

import { mkdir } from '@/lib/fs';
import * as Log from '@/lib/Log';
import { getPostsListJson } from '@/lib/posts';

const executablePath = await chromium.executablePath();

const path = {
  dist: `${cwd()}/public/images/ogp`,
};

(async () => {
  await mkdir(path.dist, { recursive: true });
  const postsMap = getPostsListJson();
  const length = postsMap.size;
  const posts = [...postsMap.values()];

  let browser: Browser;

  try {
    browser = await playwright.chromium.launch({
      executablePath,
      args: [
        '--disable-extensions',
        '--disable-gpu',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding',
        '--disable-dev-shm-usage',
        '--disable-accelerated-video-decode',
        '--disable-blink-features',
        '--disable-translate',
        '--disable-popup-blocking',
        '--disable-features',
        '--disable-new-tab-first-run',
        '--enable-experimental-web-platform-features',
      ],
    });

    // 並行処理の数
    const concurrency = 10;

    // ページインスタンスを生成
    const setupPage = async () => {
      const page = await browser.newPage();
      await page.setViewportSize({ width: 1200, height: 630 });
      await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
      return page;
    };
    const pages = await Promise.all(Array.from({ length: concurrency }, setupPage));

    for (let i = 0; i < length; i += concurrency) {
      const screenshotPromises = pages.map(async (page, j) => {
        const index = i + j;
        if (index < length) {
          const { title, slug } = posts[index];
          const pageTitle = title.replace(/</g, '&lt;').replace(/>/g, '&gt;');

          await page.evaluate(async (pageTitle) => {
            document.getElementById('title').innerHTML = pageTitle;
            await document.fonts.ready;
          }, pageTitle);

          await page.screenshot({
            fullPage: false,
            path: `${path.dist}/${slug}.png`,
          });

          const processed = index + 1;
          if (processed === 1 || processed % 100 === 0 || processed === length) {
            Log.info('Generating OGP Images', `(${processed}/${length})`);
          }
        }
      });

      // 並行してスクリーンショットを撮影
      await Promise.all(screenshotPromises);
    }
  } catch (err) {
    Log.error('Generating OGP Images', err.message);
  } finally {
    await browser?.close();
  }
})();
