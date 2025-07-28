'use client';

import { useCallback, useEffect } from 'react';
import { convertPostSlugToPath } from '@/lib/url';
import type { KeyboardNavigationReturn, SearchResultData } from '../type';
import type { useSearchDOMRefs } from './useSearchDOMRefs';

type KeyboardNavigationParams = {
  searchResult: SearchResultData;
  // biome-ignore lint/suspicious/noExplicitAny: legacy callback type needs refactoring
  setSearchResult: any;
  // biome-ignore lint/suspicious/noExplicitAny: legacy callback type needs refactoring
  closeDialog: any;
  domRefs: ReturnType<typeof useSearchDOMRefs>;
};

/**
 * 検索ダイアログでのキーボードナビゲーション機能を提供するフック
 * @param params - 検索結果、状態更新関数、ダイアログ制御関数、DOM参照
 * @returns キーボードイベントハンドラーとナビゲーションキー判定関数
 */
export const useKeyboardNavigation = ({
  searchResult,
  setSearchResult,
  closeDialog,
  domRefs,
}: KeyboardNavigationParams): KeyboardNavigationReturn => {
  /**
   * ナビゲーションキーかどうかを判定する
   * @param key - キーボードイベントのキー値
   * @returns ナビゲーションキーの場合はtrue
   */
  const isNavigationKey = useCallback((key: string): boolean => {
    return key === 'ArrowDown' || key === 'ArrowUp' || key === 'Enter' || key === 'Escape' || key === 'Esc';
  }, []);

  /**
   * グローバルキーボードイベントを処理し、検索結果間のナビゲーションを制御する
   * @note DOM参照の無効化を検出し、必要に応じて参照を更新
   */
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!domRefs.dialogRef.current) {
        domRefs.updateDOMRefs();
        if (!domRefs.dialogRef.current) return;
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSearchResult((prev) => {
          if (prev.focusedIndex < prev.suggestions.length - 1) {
            return {
              ...prev,
              focusedIndex: prev.focusedIndex + 1,
            };
          }
          return prev;
        });
        return;
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSearchResult((prev) => {
          if (prev.focusedIndex > -1) {
            return {
              ...prev,
              focusedIndex: prev.focusedIndex - 1,
            };
          }
          return prev;
        });
        return;
      }

      if (e.key === 'Enter') {
        setSearchResult((prev) => {
          if (prev.focusedIndex >= 0 && prev.focusedIndex < prev.suggestions.length) {
            const suggestion = prev.suggestions[prev.focusedIndex];
            if (suggestion) {
              closeDialog();
              const link = convertPostSlugToPath(suggestion.slug);
              window.location.href = link;
            }
          }
          return prev;
        });
        return;
      }

      if (e.key === 'Escape' || e.key === 'Esc') {
        closeDialog();
        return;
      }
    },
    [domRefs, setSearchResult, closeDialog],
  );

  // キーボードイベントリスナーの登録・削除
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return {
    handleKeyDown,
    isNavigationKey,
  };
};
