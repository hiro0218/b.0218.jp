'use client';

import { type RefObject, useCallback, useMemo, useRef } from 'react';
import type { SearchResultItem } from '../types';
import { useSearchNavigation } from './useSearchNavigation';
import { useSearchQuery } from './useSearchQuery';
import { useSearchUI } from './useSearchUI';

/**
 * useSearch のオプション
 */
export interface UseSearchOptions {
  /** ダイアログを閉じる処理（オプション） */
  onClose?: () => void;

  /** ダイアログの ref（オプション） */
  dialogRef?: RefObject<HTMLDialogElement>;

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

  /**
   * ループナビゲーションを有効化
   *
   * @default true
   */
  loop?: boolean;
}

/**
 * useSearch の戻り値
 */
export interface UseSearchReturn {
  /** 現在の検索クエリ */
  query: string;

  /** 検索結果 */
  results: SearchResultItem[];

  /** データ読み込み中か */
  isLoading: boolean;

  /** エラー（存在する場合） */
  error: Error | null;

  /** 現在フォーカスされているインデックス */
  focusedIndex: number;

  /** 即座に検索を実行する */
  search: (query: string) => void;

  /** デバウンス検索を実行する */
  debouncedSearch: (query: string) => void;

  /** 検索結果をリセットする */
  reset: () => void;

  /** ダイアログを閉じる（フォーカスリセット + onClose） */
  close: () => void;

  /** 検索入力のprops */
  inputProps: {
    onKeyUp: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  };

  /** キーボードナビゲーション用のprops */
  containerProps: React.DOMAttributes<HTMLElement>;

  /** 検索結果要素の ref を設定 */
  setResultRef: (index: number, element: HTMLDivElement | null) => void;
}

const NAV_KEYS: ReadonlySet<string> = new Set(['ArrowDown', 'ArrowUp', 'Home', 'End', 'Enter', 'Escape']);

/**
 * 検索機能の統合 Facade
 *
 * @description
 * 以下のフックを統合し、シンプルな API を提供:
 * - useSearchQuery: 検索クエリ・データ管理
 * - useSearchNavigation: キーボードナビゲーション
 * - useSearchUI: DOM 参照・UI 操作
 *
 * @example
 * ```tsx
 * const search = useSearch({
 *   onClose: handleClose,
 *   dialogRef,
 *   persistState: true,
 *   debounceMs: 300,
 *   loop: true,
 * });
 *
 * <input {...search.inputProps} />
 * <div {...search.containerProps}>
 *   {search.results.map((result, index) => (
 *     <div ref={(el) => search.setResultRef(index, el)} key={result.slug}>
 *       {result.title}
 *     </div>
 *   ))}
 * </div>
 * ```
 */
export const useSearch = ({
  onClose,
  dialogRef,
  persistState = true,
  debounceMs = 300,
  loop = true,
}: UseSearchOptions): UseSearchReturn => {
  // ===== 検索クエリ・データ管理 =====
  const { query, results, isLoading, error, search, debouncedSearch, reset } = useSearchQuery({
    persistState,
    debounceMs,
  });

  // ===== ref を作成（useSearchNavigation に渡すため） =====
  const resultsRef = useRef<SearchResultItem[]>(results);
  resultsRef.current = results;

  // ===== DOM 参照・UI 操作（getResultRef を先に取得） =====
  const uiRef = useRef<ReturnType<typeof useSearchUI> | null>(null);
  const getResultRef = useCallback((index: number) => {
    return uiRef.current?.getResultRef(index);
  }, []);

  // ===== キーボードナビゲーション =====
  const { focusedIndex, resetFocus, containerProps } = useSearchNavigation({
    resultsLength: results.length,
    onClose,
    loop,
    resultsRef,
    getResultRef,
  });

  const focusedIndexRef = useRef(focusedIndex);
  focusedIndexRef.current = focusedIndex;

  // ===== DOM 参照・UI 操作（実際に初期化） =====
  const ui = useSearchUI({
    dialogRef,
    focusedIndex,
    resultsLength: results.length,
  });
  uiRef.current = ui;

  // ===== クローズ処理 =====
  const handleClose = useCallback(() => {
    resetFocus();
    if (onClose) onClose();
  }, [resetFocus, onClose]);

  // ===== 検索入力処理 =====
  const handleSearchInput = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!(e.currentTarget instanceof HTMLInputElement) || e.nativeEvent.isComposing) {
        return;
      }

      const value = e.currentTarget.value.trim();
      if (value === query) {
        return;
      }

      // Enter キーで入力にフォーカスがある場合（focusedIndex === -1）は即座実行
      if (e.key === 'Enter' && focusedIndexRef.current === -1) {
        search(value);
        return;
      }

      // ナビゲーションキー以外はデバウンス検索
      if (!NAV_KEYS.has(e.key)) {
        debouncedSearch(value);
      }
    },
    [query, search, debouncedSearch],
  );

  const inputProps = useMemo(
    () => ({
      onKeyUp: handleSearchInput,
    }),
    [handleSearchInput],
  );

  return {
    query,
    results,
    isLoading,
    error,
    focusedIndex,
    search,
    debouncedSearch,
    reset,
    close: handleClose,
    inputProps,
    containerProps,
    setResultRef: ui.setResultRef,
  };
};
