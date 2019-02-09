import path from 'path';
import request from 'request';
import fs from 'fs-extra';

const url = 'https://content.b.0218.jp/feed/';
const srcDir = path.resolve(__dirname, '../../');

module.exports = function() {
  this.nuxt.hook('generate:before', async generator => {
    request({ method: 'GET', url: url, encoding: null }, async function(error, response, body) {
      if (!error && response.statusCode === 200) {
        const xmlGeneratePath = path.resolve(srcDir, path.join('static', '/feed.xml'));
        await fs.ensureFile(xmlGeneratePath);
        await fs.writeFile(xmlGeneratePath, body);
      }
    });
  });
};
