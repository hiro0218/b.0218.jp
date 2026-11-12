import { cleanup, render, screen, within } from '@testing-library/react';
import type { ComponentProps } from 'react';
import { createRef } from 'react';
import { afterEach, beforeAll, expect, test, vi } from 'vitest';
import type { SearchOption } from '../types';
import { SearchResultList } from './SearchResultList';

const recentOption: SearchOption = { kind: 'recent', id: 'search-recent-0', query: 'Next.js' };
const popularOption: SearchOption = {
  kind: 'post',
  id: 'search-result-popular-1',
  slug: 'popular-1',
  title: '人気の記事',
};
const resultOption: SearchOption = {
  kind: 'post',
  id: 'search-result-css-in-js',
  slug: 'css-in-js',
  title: 'CSS in JS とは何か',
};

// ResizeObserver の置き換えを省かない。SearchResultList が一覧の高さを追うために使うが、jsdom には無い
beforeAll(() => {
  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  );
});

afterEach(cleanup);

function renderList(props: Partial<ComponentProps<typeof SearchResultList>> = {}) {
  return render(
    <SearchResultList
      focusedIndex={-1}
      listId="list"
      listRef={createRef<HTMLDivElement>()}
      mode="results"
      onKeyDown={vi.fn()}
      onPostSelect={vi.fn()}
      onRecentSelect={vi.fn()}
      onRowMouseMove={vi.fn()}
      query=""
      rows={[resultOption]}
      setRowRef={vi.fn()}
      {...props}
    />,
  );
}

function getMarkedTexts() {
  const [option] = screen.getAllByRole('option');
  return Array.from(option.querySelectorAll('mark'), (mark) => mark.textContent);
}

test('候補の場合、最近の検索と、見出しつきのよく読まれている記事を 1 つの一覧に並べる', () => {
  renderList({ mode: 'suggestions', rows: [recentOption, popularOption] });

  const listbox = screen.getByRole('listbox', { name: '検索の候補' });
  const recentGroup = within(listbox).getByRole('group', { name: '最近の検索' });
  const popularGroup = within(listbox).getByRole('group', { name: 'よく読まれている記事' });

  expect(within(recentGroup).getByRole('option', { name: 'Next.js' })).toBeDefined();
  expect(within(popularGroup).getByRole('option', { name: '人気の記事' })).toBeDefined();
});

test('記事の行は、リンク自体を option にし、option の中にリンクを置かない', () => {
  renderList({ query: 'css' });

  const option = screen.getByRole('option', { name: 'CSS in JS とは何か' });

  expect(option.tagName).toBe('A');
  expect(option.getAttribute('href')).toBe('/css-in-js.html');
  expect(within(option).queryByRole('link')).toBeNull();
});

test('フォーカス中の行にだけ aria-selected を付ける', () => {
  renderList({ mode: 'suggestions', rows: [recentOption, popularOption], focusedIndex: 1 });

  const [recent, popular] = screen.getAllByRole('option');

  expect(recent.getAttribute('aria-selected')).toBe('false');
  expect(popular.getAttribute('aria-selected')).toBe('true');
});

test('半角スペース区切りの検索語の場合、各語を強調する', () => {
  renderList({ query: 'css js', rows: [resultOption] });

  expect(getMarkedTexts()).toEqual(['CSS', 'JS']);
});

test('全角スペース区切りの検索語の場合、各語を強調する', () => {
  renderList({ query: 'css　js', rows: [resultOption] });

  expect(getMarkedTexts()).toEqual(['CSS', 'JS']);
});

test('全角英数や大文字小文字の違う検索語でも、エンジンと同じ正規化で強調する', () => {
  renderList({ query: 'ＣＳＳ', rows: [resultOption] });

  expect(getMarkedTexts()).toEqual(['CSS']);
});

test('正規表現の特殊文字を含む検索語は、文字そのものとして一致させる', () => {
  renderList({ query: 'a.b', rows: [{ ...resultOption, title: 'a.b と aXb' }] });

  expect(getMarkedTexts()).toEqual(['a.b']);
});

test('一致する文字が無い行は、タイトル全体を 1 つの文字列として出す', () => {
  renderList({ query: 'zzqqxx', rows: [resultOption] });

  expect(screen.getByRole('option').textContent).toBe('CSS in JS とは何か');
  expect(getMarkedTexts()).toEqual([]);
});
