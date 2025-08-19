import type { SetStateAction } from 'react';
import { useCallback, useEffect } from 'react';
import { isEscapeKey, isVerticalArrowKey } from '@/hooks/keyboard';
import { convertPostSlugToPath } from '@/lib/url';
import type { KeyboardNavigationReturn, SearchResultData } from '../type';
import type { useSearchDOMRefs } from './useSearchDOMRefs';

// パフォーマンス最適化：純粋関数を外部定義
const isNavigationKey = (key: string): boolean => {
  return isVerticalArrowKey(key) || key === 'Enter' || isEscapeKey(key);
};

// キーボードイベント定数
const KEY = {
  arrowDown: 'ArrowDown',
  arrowUp: 'ArrowUp',
  enter: 'Enter',
} as const;

type KeyboardNavigationParams = {
  setSearchResult: (value: SetStateAction<SearchResultData>) => void;
  closeDialog: () => void;
  domRefs: ReturnType<typeof useSearchDOMRefs>;
};

/**
 * 検索ダイアログでのキーボードナビゲーション機能を提供するフック
 * @param params - 状態更新関数、ダイアログ制御関数、DOM参照
 * @returns キーボードイベントハンドラーとナビゲーションキー判定関数
 */
export const useKeyboardNavigation = ({
  setSearchResult,
  closeDialog,
  domRefs,
}: KeyboardNavigationParams): KeyboardNavigationReturn => {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // 最も頻繁に発生するEscapeキーを最初にチェックする
      if (isEscapeKey(e.key)) {
        closeDialog();
        return;
      }

      // React StrictModeでのコンポーネント再マウント時にDOM参照が無効化される場合がある
      if (!domRefs.dialogRef.current) {
        domRefs.updateDOMRefs();
        if (!domRefs.dialogRef.current) return;
      }

      switch (e.key) {
        case KEY.arrowDown:
          e.preventDefault();
          setSearchResult((prev: SearchResultData) => {
            const nextIndex = prev.focusedIndex + 1;
            // 変更がない場合は新しいオブジェクトを作らない
            if (nextIndex >= prev.suggestions.length) return prev;
            return {
              ...prev,
              focusedIndex: nextIndex,
            };
          });
          break;

        case KEY.arrowUp:
          e.preventDefault();
          setSearchResult((prev: SearchResultData) => {
            // -1は入力フィールドのフォーカス状態を表し、検索結果とは別扱いにする
            const nextIndex = prev.focusedIndex - 1;
            // 変更がない場合は新しいオブジェクトを作らない
            if (nextIndex < -1) return prev;
            return {
              ...prev,
              focusedIndex: nextIndex,
            };
          });
          break;

        case KEY.enter:
          setSearchResult((prev: SearchResultData) => {
            if (prev.focusedIndex >= 0 && prev.focusedIndex < prev.suggestions.length) {
              const suggestion = prev.suggestions[prev.focusedIndex];
              if (suggestion) {
                // 非同期処理で重い処理を遅延実行
                requestAnimationFrame(() => {
                  closeDialog();
                  const link = convertPostSlugToPath(suggestion.slug);
                  // Next.js App RouterのクライアントサイドナビゲーションがSSRコンテンツで不安定な場合がある
                  window.location.href = link;
                });
              }
            }
            return prev;
          });
          break;

        default:
          // 処理なし
          break;
      }
    },
    [domRefs, setSearchResult, closeDialog],
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  const handleFocus = useCallback(() => {
    setSearchResult((prev: SearchResultData) => {
      // 既に-1の場合は更新しない
      if (prev.focusedIndex === -1) return prev;
      return {
        ...prev,
        focusedIndex: -1,
      };
    });
  }, [setSearchResult]);

  useEffect(() => {
    const inputElement = domRefs.inputRef.current;

    if (inputElement) {
      inputElement.addEventListener('focus', handleFocus);
    }

    return () => {
      if (inputElement) {
        inputElement.removeEventListener('focus', handleFocus);
      }
    };
  }, [domRefs.inputRef, handleFocus]);

  return {
    isNavigationKey,
  };
};
