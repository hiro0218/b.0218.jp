'use client';

import { useCallback, useEffect } from 'react';
import type { SearchResultItem } from '../../types';
import { useSearchManager } from './useSearchManager';
import { readSearchStateSync, useSearchStatePersistence } from './useSearchStatePersistence';
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

  /** データ読み込み中か（SSGのため常にfalse） */
  isLoading: boolean;

  /** エラー（SSGのため常にnull） */
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
 * 検索クエリ管理、検索実行、状態永続化を統合
 *
 * @description
 * 転置インデックスベースの高速検索を使用
 * archivesパラメータは不要（ビルド時生成の検索インデックスを使用）
 *
 * 以下のフックを統合:
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

  // ===== 検索実行管理 =====
  const {
    state,
    debouncedSearch,
    executeSearch,
    reset: resetManager,
    setResults,
  } = useSearchManager({
    debounceDelayMs: debounceMs,
    getInitialState: persistState ? readSearchStateSync : undefined,
  });

  // ===== 状態永続化 =====
  const { saveSearchState, loadSearchState, clearSearchState } = useSearchStatePersistence();

  // ===== 検索状態復元 =====
  useSearchStateRestoration({
    persistState,
    executeSearch,
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
      // focusedIndex はキーボードナビゲーション用の一時的な状態であり、
      // セッション間でフォーカス位置を復元しない設計のため、永続化時は常に
      // 「未フォーカス」を表す -1 に固定する。
      // 実際のフォーカス管理は useSearchNavigation が行い、永続化された値は
      // 参照されないが、保存データのスキーマを保つためにキー自体は保持しておく。
      focusedIndex: -1,
    });
  }, [persistState, state.query, state.results, saveSearchState]);

  const search = useCallback(
    (query: string) => {
      executeSearch(query);
    },
    [executeSearch],
  );

  const reset = useCallback(() => {
    resetManager();
    clearSearchState();
  }, [resetManager, clearSearchState]);

  return {
    query: state.query,
    results: state.results,
    isLoading: false, // SSGのため常にfalse
    error: null, // SSGのため常にnull
    search,
    debouncedSearch,
    reset,
    setResults,
  };
};
