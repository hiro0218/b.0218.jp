import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';
import { PostSection } from './PostSection';

const posts = [{ slug: 'sample-post', title: 'サンプルの記事', date: '2026-02-28' }];

test.each(['timeline', 'card'] as const)(
  '見出しが無い %s の場合、一覧の題名は headingLevel の既定（h2）になる',
  (layout) => {
    render(<PostSection layout={layout} posts={posts} />);

    expect(screen.getByRole('heading', { name: 'サンプルの記事' }).tagName).toBe('H2');
  },
);

test.each(['timeline', 'card'] as const)('見出しがある %s の場合、一覧の題名は見出しの次の段になる', (layout) => {
  render(<PostSection heading="見出し" headingLevel="h2" layout={layout} posts={posts} />);

  expect(screen.getByRole('heading', { name: 'サンプルの記事' }).tagName).toBe('H3');
});

test.each([
  ['h2', 'H3'],
  ['h3', 'H4'],
  ['h4', 'H5'],
  ['h5', 'H6'],
] as const)('見出しが %s の場合、一覧の題名は次の段（%s）になる', (headingLevel, expected) => {
  render(<PostSection heading="見出し" headingLevel={headingLevel} layout="timeline" posts={posts} />);

  expect(screen.getByRole('heading', { name: 'サンプルの記事' }).tagName).toBe(expected);
});

test('見出しが空文字の場合も、見出しが無いときと同じく headingLevel の段を題名に使う', () => {
  render(<PostSection heading="" headingLevel="h2" layout="timeline" posts={posts} />);

  expect(screen.getByRole('heading', { name: 'サンプルの記事' }).tagName).toBe('H2');
});
