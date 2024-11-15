import fs from 'node:fs';
import path from 'node:path';

import { type HttpBindings, serve } from '@hono/node-server';
import { cache } from 'hono/cache';
import { compress } from 'hono/compress';
import { Hono } from 'hono/tiny';

import { Template } from './template';

type Bindings = HttpBindings & {
  query: {
    title: string;
  };
};

// biome-ignore lint/style/useNamingConvention: <explanation>
const app = new Hono<{ Bindings: Bindings }>();

const DUMMY_TITLE =
  '[Apple] Apple社を築いたSteve Jobsは1954年生まれ。彼は大学には一学期間顔を出しただけで、その後インドを二年間放浪。インドから帰るとOregonの果樹園でリンゴ作りにせいをだし、今度はElectronics仕掛けのリンゴ作りに転向した。';

const publicDirectoryPath = path.resolve(__dirname, '../../../public');

const backgroundImageBuffer = fs.readFileSync(path.join(publicDirectoryPath, 'hiro0218_screen.png'));

app.use(compress());

app.get(
  '*',
  cache({
    cacheName: 'app',
    cacheControl: 'max-age=31536000',
  }),
);

app.get('/', (c) => {
  const title = c.req.query('title') ?? DUMMY_TITLE;

  return c.html(<Template title={title.replace(/</g, '&lt;').replace(/>/g, '&gt;')} />);
});

app.get('/hiro0218_screen.png', (c) => {
  c.header('Content-Type', 'image/png');

  return c.body(backgroundImageBuffer);
});

serve(app, (info) => {
  console.log(`Listening on http://localhost:${info.port}`); // Listening on http://localhost:3000
});
