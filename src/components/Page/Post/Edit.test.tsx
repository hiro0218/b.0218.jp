import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, expect, it } from 'vitest';

import { PostEdit } from './Edit';

afterEach(cleanup);

it('slug から、GitHub で編集するリンクと、原稿そのものを見るリンクを作る', () => {
  render(<PostEdit slug="example-post" />);

  const edit = screen.getByText('Edit on GitHub').closest('a');
  const raw = screen.getByText('View raw file on GitHub').closest('a');
  expect(edit?.getAttribute('href')).toBe('https://github.com/hiro0218/article/edit/master/_posts/example-post.md');
  expect(raw?.getAttribute('href')).toBe('https://github.com/hiro0218/article/blob/master/_posts/example-post.md');
});

it('リンクは新しいタブで開き、参照元を送らない', () => {
  render(<PostEdit slug="example-post" />);

  for (const text of ['Edit on GitHub', 'View raw file on GitHub']) {
    const link = screen.getByText(text).closest('a');
    expect(link?.getAttribute('target')).toBe('_blank');
    expect(link?.getAttribute('rel')).toBe('noreferrer');
  }
});
