import { loadDefaultJapaneseParser } from 'budoux';
import { ensureDirSync, readFileSync } from 'fs-extra';
import { Browser, BrowserServer, chromium } from 'playwright';
const parser = loadDefaultJapaneseParser();

import { getPostsListJson } from '../../lib/posts';

const path = {
  dist: `${process.cwd()}/public/images/ogp`,
};

const template = readFileSync(`${process.cwd()}/src/build/ogp/template.html`, 'utf-8');

(async () => {
  ensureDirSync(path.dist);
  const posts = getPostsListJson();
  const length = posts.length;
  let browserServer: BrowserServer;
  let browser: Browser;

  try {
    browserServer = await chromium.launchServer({
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
    const wsEndpoint = browserServer.wsEndpoint();
    browser = await chromium.connect(wsEndpoint);
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
    await browserServer?.close();
    await browser?.close();
  }
})();
