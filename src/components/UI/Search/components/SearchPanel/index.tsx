import { memo, useId, useMemo } from 'react';

import { useRouteChangeComplete } from '@/hooks/useRouteChangeComplete';
import { styled } from '@/ui/styled';
import type { SearchProps } from '../../types';
import { getMarkedTitles } from './libs/markEscapedHTML';
import { Result } from './Result';

export interface SearchPanelProps {
  results: SearchProps[];
  searchQuery: string;
  focusedIndex: number;
  closeDialog: () => void;
  setResultRef: (index: number, element: HTMLDivElement | null) => void;
}

/**
 * 検索結果の表示とインタラクションを管理する
 * WHY: React.memoで最適化 - propsが変わらない限り再レンダリング不要
 */
export const SearchPanel = memo(function SearchPanel({
  results,
  searchQuery,
  focusedIndex,
  closeDialog,
  setResultRef,
}: SearchPanelProps) {
  const markedTitles = useMemo(() => getMarkedTitles(results, searchQuery), [results, searchQuery]);
  const statusId = useId();

  useRouteChangeComplete(closeDialog);

  return (
    <SearchMain aria-atomic="true" aria-label="サイト内検索" aria-live="polite" data-search-results role="search">
      <div aria-live="polite" className="sr-only" id={statusId}>
        {results.length > 0
          ? `${results.length}件の検索結果が見つかりました。${searchQuery ? `「${searchQuery}」の検索結果です。` : ''}`
          : searchQuery
            ? `「${searchQuery}」に一致する記事は見つかりませんでした。`
            : '検索キーワードを入力してください。'}
      </div>
      <Result
        focusedIndex={focusedIndex}
        keyword={searchQuery}
        markedTitles={markedTitles}
        setResultRef={setResultRef}
        suggestions={results}
      />
      <SearchFooter>
        <a href="https://www.google.com/search?q=site:b.0218.jp" rel="noreferrer" target="_blank">
          Google 検索
        </a>
      </SearchFooter>
    </SearchMain>
  );
});

const SearchMain = styled.main`
  width: min(90vw, 640px);
  max-height: calc(60vh - var(--header-height));
  overflow-y: auto;
`;

const SearchFooter = styled.footer`
  padding: var(--spacing-1);
  font-size: var(--font-sizes-xs);
  text-align: right;
  background-color: var(--colors-gray-a-2);
  border-top: 1px solid var(--colors-gray-6);

  a {
    color: var(--colors-gray-11);
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;
