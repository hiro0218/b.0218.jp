import { expect, test } from '@playwright/test';

const RSS_TAG = /<rss[\s>]/;

test('sitemap.xml is served as XML and lists URLs', async ({ request }) => {
  const res = await request.get('/sitemap.xml');

  await expect(res).toBeOK();
  expect(res.headers()['content-type']).toContain('xml');

  const body = await res.text();
  expect(body).toContain('<urlset');
});

test('feed.xml is served as RSS 2.0', async ({ request }) => {
  const res = await request.get('/feed.xml');

  await expect(res).toBeOK();
  expect(res.headers()['content-type']).toContain('xml');

  const body = await res.text();
  expect(body).toMatch(RSS_TAG);
});

test('robots.txt declares user-agent and sitemap', async ({ request }) => {
  const res = await request.get('/robots.txt');

  await expect(res).toBeOK();

  const body = await res.text();
  expect(body).toContain('User-agent:');
  expect(body).toContain('Sitemap:');
});
