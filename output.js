const fs = require('fs');

const DEST_DIR = './static';
const SRC_DIR = './_source';

const copyFile = filename => {
  fs.copyFileSync(`${SRC_DIR}/${filename}`, `${DEST_DIR}/${filename}`);
};

try {
  // feed
  copyFile(`atom.xml`);
  copyFile(`rss.xml`);
  copyFile(`feed.json`);

  // sitemap
  copyFile(`sitemap.xml`);
  copyFile(`sitemap.xsl`);
  copyFile(`post-sitemap.xml`);
  copyFile(`tag-sitemap.xml`);
  copyFile(`category-sitemap.xml`);
} catch (error) {
  console.log(error);
}
