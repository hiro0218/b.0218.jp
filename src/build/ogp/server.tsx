import { type HttpBindings, serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
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

app.use(compress());

app.get(
  '*',
  cache({
    cacheName: 'app',
    cacheControl: 'max-age=31536000',
  }),
);

app.get('/', (c) => {
  const title = (c.req.query('title') || DUMMY_TITLE).replace(/</g, '&lt;').replace(/>/g, '&gt;');

  return c.html(<Template title={title} />);
});

app.use(
  '/hiro0218_screen.png',
  serveStatic({
    path: 'public/hiro0218_screen.png',
  }),
);

serve(app, (info) => {
  console.log(`Listening on http://localhost:${info.port}`); // Listening on http://localhost:3000
});
