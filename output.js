// eslint-disable-next-line
const fs = require('fs-extra');

const DEST_DIR = './public';
const SRC_DIR = './_source';

const copyFile = (filename) => {
  fs.copyFileSync(`${SRC_DIR}/${filename}`, `${DEST_DIR}/${filename}`);
  console.log(`output.js: ${SRC_DIR}/${filename} to ${DEST_DIR}/${filename}`);
};

try {
  // data
  copyFile('archives.json');

  // feed
  copyFile('atom.xml');
  copyFile('rss.xml');
  copyFile('feed.json');

  // sitemap
  copyFile('sitemap.xml');
  copyFile('sitemap.xsl');
  copyFile('post-sitemap.xml');
  copyFile('tag-sitemap.xml');
  copyFile('category-sitemap.xml');
} catch (error) {
  console.log(error);
}
