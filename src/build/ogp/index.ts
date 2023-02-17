import { loadDefaultJapaneseParser } from 'budoux';
import { ensureDirSync, readFileSync } from 'fs-extra';
import { Browser, chromium } from 'playwright';

import { getPostsListJson } from '@/lib/posts';

const parser = loadDefaultJapaneseParser();

const path = {
  dist: `${process.cwd()}/public/images/ogp`,
};

const template = readFileSync(`${process.cwd()}/src/build/ogp/template.html`, 'utf-8');

(async () => {
  ensureDirSync(path.dist);
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
    const page = await browser.newPage();
    await page.setContent(template, {
      waitUntil: 'networkidle',
    });
    await page.setViewportSize({ width: 1200, height: 630 });

    for (let index = 0; index < length; index++) {
      const { title, slug } = posts[index];
      const pageTitle = parser.translateHTMLString(title.replace(/</g, '&lt;').replace(/>/g, '&gt;'));

      await page.evaluate(async (pageTitle: string) => {
        await Promise.all([(document.getElementById('title').innerHTML = pageTitle), document.fonts.ready]);
      }, pageTitle);

      await page
        .screenshot({
          fullPage: false,
          path: `${path.dist}/${slug}.png`,
        })
        .then(() => {
          const processed = index + 1;
          if (processed === 1 || processed % 100 === 0 || processed === length) {
            console.log('Generating OGP Images', `(${processed}/${length})`);
          }
        });
    }
  } catch (err) {
    console.error('Generating OGP Images', err.message);
  } finally {
    await browser?.close();
  }
})();
