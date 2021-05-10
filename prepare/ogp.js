const fs = require('fs-extra');
const nodeHtmlToImage = require('node-html-to-image');

const ogpImages = [];
const path = {
  src: `${process.cwd()}/dist/posts.json`,
  dist: `${process.cwd()}/public/images/ogp`,
};

const generateOgpImage = (content) => {
  let numberOfExecutions = 0;

  nodeHtmlToImage({
    html: `
    <html lang="ja">
    <head>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@900&display=swap');

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
          padding: 2vw 8vw;
          height: 100vh;
          font-family: "Noto Sans JP", sans-serif;
          font-feature-settings: "palt";
          word-wrap: break-word;
          overflow-wrap: break-word;
        }

        .title {
          margin: 1em auto 0;
          width: 100%;
          color: #212529;
          font-size: 5vw;
          line-height: 1.75;
          letter-spacing: 0.0125em;
          text-align: left;
        }

        .url {
          margin-top: auto;
          width: 100%;
          color: #868e96;
          font-family: sans-serif;
          font-size: 2vw;
          text-align: left;
        }
      </style>
    </head>
    <body>
      <h1 class="title">{{title}}</h1>
      <div class="url">b.0218.jp</div>
    </body>
    </html>`,
    content: content,
    puppeteerArgs: {
      defaultViewport: {
        width: 1200,
        height: 630,
      },
      devtools: false,
    },
    waitUntil: 'networkidle0',
    beforeScreenshot: () => {
      console.log(
        'OGP Image Generated:',
        content[numberOfExecutions].output.replace(`${path.dist}/`, ''),
        `(${++numberOfExecutions}/${content.length})`,
      );
    },
  }).then(() => console.log('OGP Image Generated.'));
};

(async () => {
  fs.ensureDirSync(path.dist);

  fs.readJson(path.src)
    .then((posts) => {
      posts.forEach((post) => {
        ogpImages.push({
          title: post.title,
          output: `${path.dist}/${post.slug}.png`,
        });
      });
    })
    .then(() => {
      generateOgpImage(ogpImages);
    })
    .catch((err) => {
      console.error(err);
    });
})();
