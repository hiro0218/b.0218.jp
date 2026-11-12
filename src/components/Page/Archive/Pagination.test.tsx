import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';
import { Pagination } from './Pagination';

const DIGITS = /\d+/;

const getPageHref = (page: number) => (page <= 1 ? '/list' : `/list/${page}`);

function visiblePages(container: HTMLElement) {
  const items = container.querySelectorAll('li[data-paginate="page"], li[data-paginate="ellipsis"]');

  return [...items].map((item) =>
    item.getAttribute('data-paginate') === 'ellipsis' ? '...' : Number(item.textContent?.match(DIGITS)?.[0]),
  );
}

test('全ページ数が 1 の場合、何も描画しない', () => {
  const { container } = render(<Pagination currentPage={1} getPageHref={getPageHref} totalPages={1} />);

  expect(container.innerHTML).toBe('');
});

test.each([
  [1, 7, [1, 2, 3, 4, 5, '...', 7]],
  [3, 10, [1, 2, 3, 4, 5, '...', 10]],
  [4, 7, [1, '...', 3, 4, 5, 6, 7]],
  [5, 10, [1, '...', 4, 5, 6, '...', 10]],
  [10, 10, [1, '...', 6, 7, 8, 9, 10]],
  [2, 2, [1, 2]],
  [3, 3, [1, 2, 3]],
  [3, 6, [1, 2, 3, 4, 5, 6]],
])(
  '現在 %i ページ・全 %i ページの場合、ページ番号と省略記号を %j の順に並べる',
  (currentPage, totalPages, expected) => {
    const { container } = render(
      <Pagination currentPage={currentPage} getPageHref={getPageHref} totalPages={totalPages} />,
    );

    expect(visiblePages(container)).toEqual(expected);
  },
);

test('途中のページの場合、前へ・次へを getPageHref が返す href のリンクにする', () => {
  render(<Pagination currentPage={3} getPageHref={getPageHref} totalPages={5} />);

  expect(screen.getByRole('link', { name: '前のページへ（現在3ページ）' }).getAttribute('href')).toBe('/list/2');
  expect(screen.getByRole('link', { name: '次のページへ（現在3ページ）' }).getAttribute('href')).toBe('/list/4');
});

test('2 ページ目の場合、前へのリンク先は getPageHref が返す 1 ページ目の href にする', () => {
  render(<Pagination currentPage={2} getPageHref={getPageHref} totalPages={3} />);

  expect(screen.getByRole('link', { name: '前のページへ（現在2ページ）' }).getAttribute('href')).toBe('/list');
});

test('1 ページ目の場合、前へを無効なボタンにする', () => {
  render(<Pagination currentPage={1} getPageHref={getPageHref} totalPages={3} />);

  expect((screen.getByRole('button', { name: '前のページへ（現在1ページ）' }) as HTMLButtonElement).disabled).toBe(
    true,
  );
});

test('最後のページの場合、次へを無効なボタンにする', () => {
  render(<Pagination currentPage={3} getPageHref={getPageHref} totalPages={3} />);

  expect((screen.getByRole('button', { name: '次のページへ（現在3ページ）' }) as HTMLButtonElement).disabled).toBe(
    true,
  );
});

test('現在のページは aria-current を付けたリンクでない要素にして、他のページはリンクにする', () => {
  const { container } = render(<Pagination currentPage={2} getPageHref={getPageHref} totalPages={3} />);

  const current = container.querySelector('[aria-current="page"]');
  expect(current?.tagName).toBe('SPAN');
  expect(current?.textContent).toContain('2');
  expect(screen.getByRole('link', { name: '1ページへ移動' }).getAttribute('href')).toBe('/list');
  expect(screen.getByRole('link', { name: '3ページへ移動' }).getAttribute('href')).toBe('/list/3');
  expect(screen.queryByRole('link', { name: '2ページへ移動' })).toBeNull();
});

test('現在位置は、スクリーンリーダー向けに全ページ数つきで通知する', () => {
  render(<Pagination currentPage={2} getPageHref={getPageHref} totalPages={5} />);

  expect(screen.getByText('5ページ中2ページ目')).toBeDefined();
});
