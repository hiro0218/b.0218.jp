import { loadDefaultJapaneseParser } from 'budoux';
import { ensureDirSync, readFileSync } from 'fs-extra';
import { chromium } from 'playwright';
const parser = loadDefaultJapaneseParser();

import { getPostsJson } from '../../lib/posts';

const path = {
  dist: `${process.cwd()}/public/images/ogp`,
};

const template = readFileSync(`${process.cwd()}/src/build/ogp/template.html`, 'utf-8');

(async () => {
  ensureDirSync(path.dist);
  const posts = getPostsJson();
  const length = posts.length;
  let browser = null;

  try {
    browser = await chromium.launch();
    const page = await browser.newPage();
    await page.setContent(template, {
      waitUntil: 'domcontentloaded'
    })
    await page.setViewportSize({ width: 1200, height: 630 });

    let index = 1;
    for (const { title, slug } of posts) {
      const pageTitle = parser.translateHTMLString(title.replace(/</g, '&lt;').replace(/>/g, '&gt;'))

      await page.evaluate(async (pageTitle: string) => {
        await Promise.all([
          document.getElementById('title').innerHTML = pageTitle,
          document.fonts.ready,
        ]);
      }, pageTitle);

      const content = await page.$('body');
      await content.screenshot({
        fullPage: false,
        path: `${path.dist}/${slug}.png`,
      }).then(() => {
        if (index === 1 || index % 100 === 0 || index === length) {
          console.log('Generating OGP Images', `(${index}/${length})`);
        }
      });

      index++;
    }
  } catch (err) {
    console.error('Generating OGP Images', err.message);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
})();
