import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import url from 'node:url';

const hostname = 'localhost';
const port = 3000;
const publicDirectoryPath = path.resolve(__dirname, '../../../public');

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // root path request processing
  if (pathname === '/') {
    fs.readFile(path.join(__dirname, 'template.html'), (err, data) => {
      if (err) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Internal Server Error');
      } else {
        const title = (parsedUrl.query.title as string).replace(/</g, '&lt;').replace(/>/g, '&gt;');
        const content = data.toString();
        let modifiedContent = content;

        if (title) {
          modifiedContent = content.replace('{{title}}', title);
        } else {
          const defaultValue =
            '[Apple] Apple社を築いたSteve Jobsは1954年生まれ。彼は大学には一学期間顔を出しただけで、その後インドを二年間放浪。インドから帰るとOregonの果樹園でリンゴ作りにせいをだし、今度はElectronics仕掛けのリンゴ作りに転向した。';
          modifiedContent = content.replace('{{title}}', defaultValue);
        }

        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        res.end(modifiedContent);
      }
    });
  } else {
    // 画像ファイルへのリクエスト処理
    // 安全なパスへと正規化して、ディレクトリトラバーサル攻撃を防ぐ
    const safePath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
    const filePath = path.join(publicDirectoryPath, safePath);

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain');
        res.end('404 Not Found');
      } else {
        const ext = path.extname(filePath);
        const mimeTypes = {
          '.jpg': 'image/jpeg',
          '.jpeg': 'image/jpeg',
          '.png': 'image/png',
          '.gif': 'image/gif',
          '.svg': 'image/svg+xml',
        };
        const contentType = mimeTypes[ext] || 'application/octet-stream';
        res.setHeader('Content-Type', contentType);
        res.end(data);
      }
    });
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
