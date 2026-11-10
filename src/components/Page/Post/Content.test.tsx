import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeAll, beforeEach, expect, it, vi } from 'vitest';

import { PostContent } from './Content';

const route = vi.hoisted(() => ({ pathname: '/a.html' }));

vi.mock('next/navigation', () => ({ usePathname: () => route.pathname }));

vi.mock('next/script', async () => {
  const { createElement } = await import('react');
  return {
    default: ({ src, strategy }: { src: string; strategy: string }) =>
      createElement('script', { 'data-strategy': strategy, src }),
  };
});

beforeAll(() => {
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      observe() {}
      disconnect() {}
    },
  );
});

beforeEach(() => {
  route.pathname = '/a.html';
  window.adsbygoogle = [];
});

afterEach(() => {
  cleanup();
  Reflect.deleteProperty(window, 'adsbygoogle');
  Reflect.deleteProperty(window, 'twttr');
});

const TWO_HEADINGS = '<h2>見出し1</h2><p>本文1</p><h2>見出し2</h2><p>本文2</p>';

// 枠の子の要素名の列で比べない。広告の外枠の要素を替えるだけで、順序が同じでも落ちるため
const follows = (earlier: Element, later: Element) =>
  (earlier.compareDocumentPosition(later) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0;

it('目次、本文、広告を、この順に 1 つの枠の中へ並べる', () => {
  const { container } = render(<PostContent content="<h2>はじめに</h2><p>本文</p>" />);

  const root = container.firstElementChild;
  const toc = screen.getByRole('navigation', { name: '目次' });
  const body = container.querySelector('section.e-content');
  const ad = screen.getByRole('complementary', { name: 'スポンサーリンク' });
  if (!body) throw new Error('section.e-content が見つからない');

  expect([toc, body, ad].every((part) => root?.contains(part))).toBe(true);
  expect(follows(toc, body)).toBe(true);
  expect(follows(body, ad)).toBe(true);
  // 見出しの文字は完全一致で比べない。目次が末尾に「#」のリンクを足すため
  expect(body.querySelector('.post-content h2')?.textContent).toContain('はじめに');
});

it('見出しが 2 つある本文の場合、本文のあいだと末尾に広告を 1 つずつ置く', () => {
  const { container } = render(<PostContent content={TWO_HEADINGS} />);

  const section = container.querySelector('section.e-content');
  expect(Array.from(section?.children ?? []).map((child) => child.className.includes('post-content'))).toEqual([
    true,
    false,
    true,
  ]);
  expect(section?.children[1].querySelector('aside')?.getAttribute('aria-label')).toBe('スポンサーリンク');
  expect(container.querySelectorAll('aside[aria-label="スポンサーリンク"]')).toHaveLength(2);
  expect(window.adsbygoogle).toHaveLength(2);
});

it('twitter-tweet を含む本文の場合、widgets.js を lazyOnload で読み込む', () => {
  const { container } = render(<PostContent content='<blockquote class="twitter-tweet"><p>tweet</p></blockquote>' />);

  const script = container.querySelector('script');
  expect(script?.getAttribute('src')).toBe('https://platform.twitter.com/widgets.js');
  expect(script?.getAttribute('data-strategy')).toBe('lazyOnload');
});

it('twitter-tweet を含まない本文の場合、widgets.js を読み込まない', () => {
  const { container } = render(<PostContent content="<p>本文</p>" />);

  expect(container.querySelector('script')).toBeNull();
});

it('twttr が読み込み済みの場合、本文の要素を渡して widgets.load を呼び、パスが変わるたびに呼び直す', () => {
  const load = vi.fn();
  window.twttr = { widgets: { load } } as unknown as Window['twttr'];

  const { container, rerender } = render(<PostContent content="<p>本文</p>" />);
  expect(load).toHaveBeenCalledTimes(1);
  expect(load).toHaveBeenCalledWith(container.querySelector('section.e-content'));

  route.pathname = '/b.html';
  rerender(<PostContent content="<p>本文</p>" />);

  expect(load).toHaveBeenCalledTimes(2);
});
