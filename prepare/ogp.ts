import fs from 'fs-extra';
import { Cluster } from 'puppeteer-cluster';

const path = {
  src: `${process.cwd()}/dist/posts.json`,
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
      text-align: left;
      font-family: "Noto Sans JP", sans-serif;
      font-feature-settings: "palt";
      word-wrap: break-word;
      overflow-wrap: break-word;
    }

    .title {
      margin: 1.5em auto 0;
      padding: 0 140px;
      width: 100%;
      color: #212529;
      font-size: 48px;
      line-height: 1.75;
      letter-spacing: 0.0025em;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
      overflow: hidden;
    }

    .url {
      margin: auto 0 1em;
      color: #868e96;
      font-size: 24px;
      width: 100%;
      padding: 0 80px;
    }
  </style>
</head>
<body>
  <h1 class="title">{{title}}</h1>
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
  const posts = fs.readJsonSync(path.src);
  const length = posts.length;

  const cluster = await Cluster.launch({
    concurrency: Cluster.CONCURRENCY_PAGE,
    maxConcurrency: 10,
    puppeteerOptions: {
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
    },
  });

  await cluster.task(async ({ page, data: { post, index } }) => {
    await page
      .setContent(html.replace('{{title}}', post.title.replace(/</g, '&lt;').replace(/>/g, '&gt;')), {
        waitUntil: 'networkidle0',
      })
      .then(() => {
        console.log('OGP Image Generated:', `${post.slug}.png`, `(${index + 1}/${length})`);
      });
    const content = await page.$('body');
    await content.screenshot({ path: `${path.dist}/${post.slug}.png` });
    await page.close();
  });

  posts.forEach((post, index) => {
    cluster.queue({ post, index });
  });

  await cluster.idle();
  await cluster.close();
})();
