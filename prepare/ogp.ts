import fs from 'fs-extra';
import puppeteer from 'puppeteer';

import { getPostsJson } from '../lib/posts';

const path = {
  dist: `${process.cwd()}/public/images/ogp`,
};

const html = `
<html lang="ja">
<head>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/mojik@0.5.0/mojik.css">
  <style>
    @import url("https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@900&display=swap");

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
      line-height: 1.8;
      letter-spacing: 0.0025em;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
      overflow: hidden;
    }

    .url {
      margin: auto 0 0;
      color: #868e96;
      font-size: 28px;
      width: 100%;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="title-container">
    <h1 class="title">{{title}}</h1>
  </div>
  <div class="url">b.0218.jp</div>

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
    browser = await puppeteer.launch({
      defaultViewport: {
        width: 1200,
        height: 630,
      },
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu',
      ],
    });
    const page = await browser.newPage();

    let index = 1;
    for (const { title, slug } of posts) {
      await page
        .setContent(html.replace('{{title}}', title.replace(/</g, '&lt;').replace(/>/g, '&gt;')), {
          waitUntil: 'domcontentloaded',
        })
        .then(() => {
          if (index === 1 || index % 10 === 0 || index === length) {
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
