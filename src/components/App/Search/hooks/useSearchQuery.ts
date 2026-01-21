'use client';

import { useCallback, useEffect } from 'react';
import { usePostsData } from '../data/usePostsData';
import type { SearchResultItem } from '../types';
import { useSearchManager } from './useSearchManager';
import { useSearchStatePersistence } from './useSearchStatePersistence';
import { useSearchStateRestoration } from './useSearchStateRestoration';

/**
 * useSearchQuery のオプション
 */
export interface UseSearchQueryOptions {
  /**
   * 検索状態を sessionStorage に永続化するか
   *
   * @default true
   */
  persistState?: boolean;

  /**
   * デバウンス遅延（ミリ秒）
   *
   * @default 300
   */
  debounceMs?: number;
}

/**
 * useSearchQuery の戻り値
 */
export interface UseSearchQueryReturn {
  /** 現在の検索クエリ */
  query: string;

  /** 検索結果 */
  results: SearchResultItem[];

  /** データ読み込み中か */
  isLoading: boolean;

  /** エラー（存在する場合） */
  error: Error | null;

  /** 即座に検索を実行する */
  search: (query: string) => void;

  /** デバウンス検索を実行する */
  debouncedSearch: (query: string) => void;

  /** 検索結果をリセットする */
  reset: () => void;

  /** 内部使用: 検索結果を直接設定する（復元時のみ使用） */
  setResults: (results: SearchResultItem[], query: string) => void;
}

/**
 * 検索クエリ管理、データフェッチ、検索実行、状態永続化を統合
 *
 * @description
 * 以下のフックを統合:
 * - usePostsData: データフェッチ・キャッシュ
 * - useSearchManager: 検索実行管理
 * - useSearchStatePersistence: 状態永続化
 * - useSearchStateRestoration: 検索状態復元
 *
 * @example
 * ```tsx
 * const { query, results, search, debouncedSearch } = useSearchQuery({
 *   persistState: true,
 *   debounceMs: 300,
 * });
 * ```
 */
export const useSearchQuery = (options: UseSearchQueryOptions = {}): UseSearchQueryReturn => {
  const { persistState = true, debounceMs = 300 } = options;

  // ===== データフェッチ =====
  const { data: archives, isLoading, error } = usePostsData();

  // ===== 検索実行管理 =====
  const { state, debouncedSearch, executeSearch, reset, setResults } = useSearchManager({
    archives,
    debounceDelayMs: debounceMs,
  });

  // ===== 状態永続化 =====
  const { saveSearchState, loadSearchState } = useSearchStatePersistence();

  // ===== 検索状態復元 =====
  useSearchStateRestoration({
    persistState,
    archives,
    executeSearch,
    // focusedIndex は useSearchNavigation で管理するため、ダミー関数を渡す
    setFocusedIndex: () => {},
    setResults,
    loadSearchState,
  });

  // ===== 状態保存 =====
  useEffect(() => {
    if (!persistState) return;
    if (!state.query && state.results.length === 0) return;

    saveSearchState({
      query: state.query,
      results: state.results,
      focusedIndex: -1, // focusedIndex は useSearchNavigation で管理
    });
  }, [persistState, state.query, state.results, saveSearchState]);

  const search = useCallback(
    (query: string) => {
      executeSearch(query);
    },
    [executeSearch],
  );

  return {
    query: state.query,
    results: state.results,
    isLoading,
    error,
    search,
    debouncedSearch,
    reset,
    setResults,
  };
};
