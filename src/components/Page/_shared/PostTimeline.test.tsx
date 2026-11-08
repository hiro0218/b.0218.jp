import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';
import { PostTimeline } from './PostTimeline';

const posts = [{ slug: 'sample-post', title: 'サンプルの記事', date: '2026/02/28' }];

test('日付は渡された値をそのまま表示する', () => {
  render(<PostTimeline posts={posts} />);

  expect(screen.getByText('2026/02/28')).toBeDefined();
});

test('time 要素の dateTime に、元の日付をそのまま渡す', () => {
  render(<PostTimeline posts={posts} />);

  expect(screen.getByText('2026/02/28').getAttribute('datetime')).toBe('2026/02/28');
});

test('タグのある記事の場合、タグをリンクにせず文字だけで並べる', () => {
  render(
    <PostTimeline
      posts={[{ slug: 'sample-post', title: 'サンプルの記事', date: '2026/02/28', tags: ['TypeScript', 'CSS'] }]}
    />,
  );

  expect(screen.getByText('TypeScript')).toBeDefined();
  expect(screen.getByText('CSS')).toBeDefined();
  expect(screen.getAllByRole('link')).toHaveLength(1);
});
