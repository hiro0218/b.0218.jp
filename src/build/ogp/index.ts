import { loadDefaultJapaneseParser } from 'budoux';
import { type Browser, chromium } from 'playwright';

import { mkdir, readFile } from '@/lib/fs';
import * as Log from '@/lib/Log';
import { getPostsListJson } from '@/lib/posts';

const parser = loadDefaultJapaneseParser();

const path = {
  dist: `${process.cwd()}/public/images/ogp`,
};

(async () => {
  const template = await readFile(`${process.cwd()}/src/build/ogp/template.html`, 'utf-8');
  await mkdir(path.dist, { recursive: true });
  const posts = getPostsListJson();
  const length = posts.length;
  let browser: Browser;

  try {
    browser = await chromium.launch({
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
      ],
    });

    // 並行処理の数
    const concurrency = 10;

    // ページインスタンスを生成
    const setupPage = async (template: string) => {
      const page = await browser.newPage();
      await page.setContent(template, { waitUntil: 'networkidle' });
      await page.setViewportSize({ width: 1200, height: 630 });
      return page;
    };
    const pages = await Promise.all(Array.from({ length: concurrency }, () => setupPage(template)));

    for (let i = 0; i < length; i += concurrency) {
      const screenshotPromises = pages.map(async (page, j) => {
        const index = i + j;
        if (index < length) {
          const { title, slug } = posts[index];
          const pageTitle = parser.translateHTMLString(title.replace(/</g, '&lt;').replace(/>/g, '&gt;'));

          await page.evaluate(async (pageTitle) => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
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
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    await browser?.close();
  }
})();
