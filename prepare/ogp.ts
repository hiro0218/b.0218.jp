import { loadDefaultJapaneseParser } from 'budoux';
import fs from 'fs-extra';
import { chromium } from 'playwright';
const parser = loadDefaultJapaneseParser();

import { getPostsJson } from '../lib/posts';

const path = {
  dist: `${process.cwd()}/public/images/ogp`,
};

const html = `
<html lang="ja">
<head>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/mojik@0.5.0/mojik.css">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@500;900&display=swap');

    *,
    *::before,
    *::after {
      box-sizing: border-box;
    }

    body {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      flex-direction: column;
      width: 1200px;
      height: 630px;
      padding: 20px 140px;
      text-align: center;
      font-family: "Noto Sans JP", sans-serif;
      font-feature-settings: "palt";
      word-wrap: break-word;
      overflow-wrap: break-word;
      line-break: strict;
    }

    .title-container {
      display: flex;
      align-items: center;
      height: 100%;
      width: 100%;
    }

    .title {
      margin: 0 auto;
      width: 100%;
      color: #212529;
      font-size: 56px;
      font-weight: 900;
      line-height: 1.8;
      letter-spacing: 0.0025em;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
      overflow: hidden;
    }

    .avator {
      display: block;
      border-radius: 100%;
      margin-right: 0.25em;
    }

    .url {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      margin: auto 0 0;
      color: #868e96;
      font-size: 28px;
      font-weight: 500;
      width: 100%;
    }
  </style>
</head>
<body>
  <div class="title-container">
    <h1 class="title">{{title}}</h1>
  </div>
  <div class="url">
  <img class="avator" width="50px" height="50px" src="data:image/webp;base64,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">
  b.0218.jp
  </div>

  <script src="https://cdn.jsdelivr.net/npm/mojik@0.5.0/mojik.min.js"></script>
  <script>
    Mojik.compose(".title");
  </script>
</body>
</html>
`;

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
