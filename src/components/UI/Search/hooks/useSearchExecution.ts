'use client';

import { useCallback, useMemo } from 'react';
import debounce from '@/lib/debounce';
import type { SearchExecutionReturn, SearchProps, SearchResultData } from '../type';
import { useSearchWithCache } from '../utils/search';

const initialSearchResult: SearchResultData = {
  keyword: '',
  suggestions: [],
  focusedIndex: -1,
};

type SearchExecutionParams = {
  archives: SearchProps[];
  // biome-ignore lint/suspicious/noExplicitAny: legacy callback type needs refactoring
  setSearchResult: any;
};

/**
 * 検索実行とデバウンス処理を提供するフック
 * @param params - 検索対象データと状態更新関数
 * @returns 検索関数とデバウンス付き検索関数
 */
export const useSearchExecution = ({ archives, setSearchResult }: SearchExecutionParams): SearchExecutionReturn => {
  // キャッシュ付き検索機能を使用
  const searchWithCache = useSearchWithCache();

  /**
   * デバウンス処理された検索機能
   * @param value - 検索クエリ文字列
   * @note 空文字列の場合は初期状態にリセット、新しい検索結果では常にインプットにフォーカス
   */
  const searchFunction = useCallback(
    (value: string) => {
      if (!value) {
        setSearchResult(initialSearchResult);
        return;
      }

      // キャッシュ有効な検索機能を使用
      const suggestions = searchWithCache(archives, value);
      setSearchResult({
        keyword: value,
        suggestions,
        focusedIndex: -1, // 新しい検索結果では常にinputにフォーカス
      });
    },
    [archives, setSearchResult, searchWithCache],
  );

  const debouncedSearch = useMemo(() => {
    return debounce<string>(searchFunction, 300);
  }, [searchFunction]);

  return {
    searchFunction,
    debouncedSearch,
  };
};
