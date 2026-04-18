import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { Hono } from 'hono';

const PORT = 6006;
const HOST = '127.0.0.1';

const app = new Hono();
app.use('*', serveStatic({ root: './storybook-static' }));

serve({ fetch: app.fetch, port: PORT, hostname: HOST });
