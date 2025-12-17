import { serve } from '@hono/node-server';
import { Hono } from 'hono/tiny';

import * as Log from '~/tools/logger';

import { OGP_CONFIG } from './config';
import { Template } from './template';

const app = new Hono();

const DUMMY_TITLE =
  '[Apple] Apple社を築いたSteve Jobsは1954年生まれ。彼は大学には一学期間顔を出しただけで、その後インドを二年間放浪。インドから帰るとOregonの果樹園でリンゴ作りにせいをだし、今度はElectronics仕掛けのリンゴ作りに転向した。';

const MAX_TITLE_LENGTH = 200;

const sanitizeTitle = (title: string): string => {
  return title
    .slice(0, MAX_TITLE_LENGTH)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
};

app.get('/', (c) => {
  const rawTitle = c.req.query('title') || DUMMY_TITLE;
  const title = sanitizeTitle(rawTitle);

  return c.html(<Template title={title} />);
});

serve(
  {
    fetch: app.fetch,
    port: OGP_CONFIG.server.port,
  },
  (info) => {
    Log.info('OGP Server', `Listening on http://localhost:${info.port}`);
  },
);
