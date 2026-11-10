import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, expect, it } from 'vitest';

import { PostHeader } from './Header';

afterEach(cleanup);

const baseProps = {
  title: '記事の題名',
  date: '2024/01/02',
  tagsWithCount: [{ slug: 'react', count: 3, isNavigable: true }],
};

it('題名を見出しに、日付とタグを並べて描画する', () => {
  render(<PostHeader {...baseProps} />);

  expect(screen.getByRole('heading', { level: 1, name: '記事の題名' })).toBeDefined();
  expect(screen.getByText('2024/01/02')).toBeDefined();
  expect(screen.getByRole('link', { name: (name) => name.includes('react') })).toBeDefined();
});

// header の子の個数や階層で比べない。内側の Stack を 1 つ外すだけで、並びが同じでも落ちるため
const follows = (earlier: Element, later: Element) =>
  (earlier.compareDocumentPosition(later) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0;

it('children を渡した場合、題名・日付・タグの後ろに描画する', () => {
  const { container } = render(
    <PostHeader {...baseProps}>
      <p>差し込み</p>
    </PostHeader>,
  );

  const inserted = screen.getByText('差し込み');
  expect(container.querySelector('header')?.contains(inserted)).toBe(true);
  expect(follows(screen.getByRole('heading', { level: 1, name: '記事の題名' }), inserted)).toBe(true);
  expect(follows(screen.getByText('2024/01/02'), inserted)).toBe(true);
  expect(follows(screen.getByRole('link', { name: (name) => name.includes('react') }), inserted)).toBe(true);
});

it('リンクのタグの場合、タグ名を p-category の span で包み、rel="tag" を付ける', () => {
  render(<PostHeader {...baseProps} />);

  const link = screen.getByRole('link', { name: (name) => name.includes('react') });
  expect(link.getAttribute('rel')).toBe('tag');
  expect(link.querySelector('span.p-category')?.textContent).toBe('react');
});

it('リンクでないタグの場合、span 自身に p-category を付ける', () => {
  const { container } = render(
    <PostHeader {...baseProps} tagsWithCount={[{ slug: 'go', count: 1, isNavigable: false }]} />,
  );

  expect(container.querySelector('span.p-category')?.textContent).toBe('go');
  expect(screen.queryByRole('link', { name: (name) => name.includes('go') })).toBeNull();
});
