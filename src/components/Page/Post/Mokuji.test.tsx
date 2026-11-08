import { cleanup, render, screen } from '@testing-library/react';
import { StrictMode, useRef } from 'react';
import { afterEach, beforeAll, expect, test, vi } from 'vitest';

import { Mokuji } from './Mokuji';

vi.mock('next/navigation', () => ({ usePathname: () => '/test' }));

const observerOptions: Array<IntersectionObserverInit | undefined> = [];

beforeAll(() => {
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      constructor(_callback: unknown, options?: IntersectionObserverInit) {
        observerOptions.push(options);
      }
      observe() {}
      disconnect() {}
    },
  );
});

afterEach(cleanup);

function Article({ html, className }: { html: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <>
      <Mokuji className={className} refContent={ref} />
      <div dangerouslySetInnerHTML={{ __html: html }} ref={ref} />
    </>
  );
}

test('見出しの「#」リンクは、見出しの文字を含む名前を持ち、その見出しへ移動する', () => {
  render(<Article html="<h2>はじめに</h2><h3>検証ツール</h3>" />);

  const anchors = screen.getAllByRole('link', { name: (name) => name.endsWith('へのリンク') });
  expect(anchors.map((anchor) => anchor.getAttribute('aria-label'))).toEqual([
    '「はじめに」へのリンク',
    '「検証ツール」へのリンク',
  ]);
  expect(screen.queryAllByRole('link', { name: '#' })).toEqual([]);

  expect(anchors[1].getAttribute('href')).toBe(screen.getByRole('link', { name: '検証ツール' }).getAttribute('href'));
});

test('目次の nav は「目次」という名前を持ち、見出しがあれば表示する', () => {
  render(<Article html="<h2>はじめに</h2>" />);

  expect(screen.getByRole('navigation', { name: '目次' }).getAttribute('data-visible')).toBe('true');
});

test.each([
  ['見出しが 1 つも無い', '<p>本文だけ</p>'],
  ['見出しが引用の中にしか無い', '<blockquote><h2>引用の見出し</h2></blockquote>'],
])('%s記事では、目次の枠を隠す', (_name, html) => {
  render(<Article html={html} />);

  expect(screen.getByRole('navigation', { name: '目次' }).getAttribute('data-visible')).toBe('false');
});

test('className を渡した場合、目次の nav に付ける', () => {
  render(<Article className="from-parent" html="<h2>はじめに</h2>" />);

  expect(screen.getByRole('navigation', { name: '目次' }).classList.contains('from-parent')).toBe(true);
});

test('StrictMode で effect が 2 回実行されても、目次の一覧は 1 つだけ作る', () => {
  render(
    <StrictMode>
      <Article html="<h2>はじめに</h2><h2>おわりに</h2>" />
    </StrictMode>,
  );

  const nav = screen.getByRole('navigation', { name: '目次' });
  expect(nav.querySelectorAll('[data-mokuji-list]')).toHaveLength(1);
  expect(nav.querySelectorAll('li')).toHaveLength(2);
});

test('現在地の判定は、固定ヘッダーの高さに余白を足した 100px だけ、画面の上端から下げた位置を基準にする', () => {
  observerOptions.length = 0;

  render(<Article html="<h2>はじめに</h2>" />);

  expect(observerOptions.at(-1)?.rootMargin).toBe('-100px 0px 0px 0px');
});
