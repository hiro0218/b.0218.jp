import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import url from 'node:url';

const hostname = 'localhost';
const port = 3000;

const IMAGE_MIME_TYPES = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
};

const DUMMY_TITLE =
  '[Apple] Apple社を築いたSteve Jobsは1954年生まれ。彼は大学には一学期間顔を出しただけで、その後インドを二年間放浪。インドから帰るとOregonの果樹園でリンゴ作りにせいをだし、今度はElectronics仕掛けのリンゴ作りに転向した。';

const publicDirectoryPath = path.resolve(__dirname, '../../../public');
const template = fs.readFileSync(path.join(__dirname, 'template.html'), 'utf-8');

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  if (pathname === '/') {
    const title = (parsedUrl.query.title as string)?.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const modifiedContent = template.replace('{{title}}', title ?? DUMMY_TITLE);

    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Cache-Control', 'public, max-age=31536000');
    res.statusCode = 200;
    res.end(modifiedContent);
  } else if (Object.keys(IMAGE_MIME_TYPES).includes(path.extname(pathname))) {
    const safePath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
    const filePath = path.join(publicDirectoryPath, safePath);

    const stream = fs.createReadStream(filePath);
    const ext = path.extname(filePath);
    const contentType = IMAGE_MIME_TYPES[ext] || 'application/octet-stream';

    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=31536000');
    stream.pipe(res);
    stream.on('error', () => {
      response404(res);
    });
  } else {
    response404(res);
  }
});

function response404(res) {
  res.statusCode = 404;
  res.setHeader('Content-Type', 'text/plain');
  res.end('404 Not Found');
}

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
