import { expect, test } from 'vitest';
import { SITE_URL } from '@/constants';
import { isSiteUrl } from './rehypeExternalLink';

test.each([SITE_URL, `${SITE_URL}/foo.html`])('自サイトの URL %s の場合、true を返す', (href) => {
  expect(isSiteUrl(href)).toBe(true);
});

test.each([`https://example.com/?url=${SITE_URL}/foo.html`, `${SITE_URL}.example.com/`])(
  '自サイトの URL を含むだけの別の URL %s の場合、false を返す',
  (href) => {
    expect(isSiteUrl(href)).toBe(false);
  },
);
