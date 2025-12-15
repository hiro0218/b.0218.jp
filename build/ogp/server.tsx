import { type HttpBindings, serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { secureHeaders } from 'hono/secure-headers';
import { Hono } from 'hono/tiny';

import { Template } from './template';

interface Bindings extends HttpBindings {
  query: {
    title: string;
  };
}

// biome-ignore lint/style/useNamingConvention: Hono Instance
const app = new Hono<{ Bindings: Bindings }>();

const DUMMY_TITLE =
  '[Apple] Apple社を築いたSteve Jobsは1954年生まれ。彼は大学には一学期間顔を出しただけで、その後インドを二年間放浪。インドから帰るとOregonの果樹園でリンゴ作りにせいをだし、今度はElectronics仕掛けのリンゴ作りに転向した。';

const MAX_TITLE_LENGTH = 200;

/**
 * セキュリティ強化のためのHTTPヘッダーを付与するミドルウェアを適用
 * Content Security Policy（CSP）を設定し、外部リソースの読み込み先を厳格に制限することでXSS等の攻撃リスクを低減できる
 * 不要な外部リソースの混入を防ぐことで副次的に安定したレンダリングに寄与させる意図
 */
app.use(
  secureHeaders({
    contentSecurityPolicy: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      imgSrc: ["'self'", 'data:'],
    },
  }),
);

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

  // レスポンスヘッダーの最適化
  c.header('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
  c.header('Content-Type', 'text/html; charset=utf-8');
  c.header('X-Content-Type-Options', 'nosniff');

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
