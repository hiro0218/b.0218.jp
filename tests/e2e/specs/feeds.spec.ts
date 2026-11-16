import { expect, test } from '@playwright/test';

const RSS_TAG = /<rss[\s>]/;

test('sitemap.xml を取得した場合、XML で URL の一覧を返す', async ({ request }) => {
  const res = await request.get('/sitemap.xml');

  await expect(res).toBeOK();
  expect(res.headers()['content-type']).toContain('xml');

  const body = await res.text();
  expect(body).toContain('<urlset');
});

test('feed.xml を取得した場合、RSS 2.0 で返す', async ({ request }) => {
  const res = await request.get('/feed.xml');

  await expect(res).toBeOK();
  expect(res.headers()['content-type']).toContain('xml');

  const body = await res.text();
  expect(body).toMatch(RSS_TAG);
});

test('robots.txt を取得した場合、User-agent と Sitemap を宣言する', async ({ request }) => {
  const res = await request.get('/robots.txt');

  await expect(res).toBeOK();

  const body = await res.text();
  expect(body).toContain('User-agent:');
  expect(body).toContain('Sitemap:');
});
