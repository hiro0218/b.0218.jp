import { loadDefaultJapaneseParser } from 'budoux';
import fs from 'fs-extra';
import { chromium } from 'playwright';
const parser = loadDefaultJapaneseParser();

import { getPostsJson } from '../../lib/posts';

const path = {
  dist: `${process.cwd()}/public/images/ogp`,
};

const html = fs.readFileSync(`${process.cwd()}/src/build/ogp/template.html`, 'utf-8');

(async () => {
  fs.ensureDirSync(path.dist);
  const posts = getPostsJson();
  const length = posts.length;
  let browser = null;

  try {
    browser = await chromium.launch();
    const page = await browser.newPage();

    await page.setViewportSize({ width: 1200, height: 630 });

    let index = 1;
    for (const { title, slug } of posts) {
      await page
        .setContent(
          html.replace('{{title}}', parser.translateHTMLString(title.replace(/</g, '&lt;').replace(/>/g, '&gt;'))),
          {
            waitUntil: 'domcontentloaded',
          },
        )
        .then(() => {
          if (index === 1 || index % 100 === 0 || index === length) {
            console.log('Generating OGP Images', `(${index}/${length})`);
          }
        });
      await page.evaluate(async () => {
        await Promise.all([document.fonts.ready]);
      });

      const content = await page.$('body');
      await content.screenshot({
        fullPage: false,
        path: `${path.dist}/${slug}.png`,
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
