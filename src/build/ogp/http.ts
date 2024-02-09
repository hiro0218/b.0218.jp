import fs from 'node:fs';
import path from 'node:path';

// eslint-disable-next-line import/no-extraneous-dependencies
import { type HttpBindings, serve } from '@hono/node-server';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Hono } from 'hono';

type Bindings = HttpBindings & {
  query: {
    title: string;
  };
};

const app = new Hono<{ Bindings: Bindings }>();

const DUMMY_TITLE =
  '[Apple] Apple社を築いたSteve Jobsは1954年生まれ。彼は大学には一学期間顔を出しただけで、その後インドを二年間放浪。インドから帰るとOregonの果樹園でリンゴ作りにせいをだし、今度はElectronics仕掛けのリンゴ作りに転向した。';

const publicDirectoryPath = path.resolve(__dirname, '../../../public');

const template = fs.readFileSync(path.join(__dirname, 'template.html'), 'utf-8');
const backgroundImageBuffer = fs.readFileSync(path.join(publicDirectoryPath, 'hiro0218_screen.png'));

app.get('/', (c) => {
  c.header('Cache-Control', 'public, max-age=31536000');

  const title = c.req.query('title')?.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const modifiedContent = template.replace('{{title}}', title ?? DUMMY_TITLE);

  return c.html(modifiedContent);
});

app.get('/hiro0218_screen.png', (c) => {
  c.header('Content-Type', 'image/png');
  c.header('Cache-Control', 'public, max-age=31536000');

  return c.body(backgroundImageBuffer);
});

serve(app, (info) => {
  console.log(`Listening on http://localhost:${info.port}`); // Listening on http://localhost:3000
});
