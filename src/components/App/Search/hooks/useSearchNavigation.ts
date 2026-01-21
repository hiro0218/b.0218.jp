'use client';

import { useKeyboard } from '@react-aria/interactions';
import { useRouter } from 'next/navigation';
import type { RefObject } from 'react';
import { isHTMLElement } from '@/lib/browser/typeGuards';
import { convertPostSlugToPath } from '@/lib/utils/url';
import type { SearchResultItem } from '../types';
import { useSearchFocusState } from './useSearchFocusState';

/**
 * useSearchNavigation のオプション
 */
export interface UseSearchNavigationOptions {
  /** 検索結果の件数 */
  resultsLength: number;

  /** ダイアログを閉じる処理 */
  onClose: () => void;

  /** ナビゲーション時のコールバック（オプション） */
  onNavigate?: (index: number) => void;

  /**
   * ループナビゲーションを有効化
   *
   * @default true
   */
  loop?: boolean;

  /** 検索結果の配列（Enter キー時の遷移に使用） */
  resultsRef: RefObject<SearchResultItem[]>;

  /** DOM 参照取得関数（Enter キー時のクリック処理に使用） */
  getResultRef: (index: number) => HTMLDivElement | undefined;
}

/**
 * useSearchNavigation の戻り値
 */
export interface UseSearchNavigationReturn {
  /** 現在フォーカスされているインデックス */
  focusedIndex: number;

  /** フォーカスインデックスを設定 */
  setFocusedIndex: (index: number) => void;

  /** フォーカスをリセット */
  resetFocus: () => void;

  /** キーボードナビゲーション用のprops */
  containerProps: ReturnType<typeof useKeyboard>['keyboardProps'];
}

/**
 * フォーカス管理、キーボードナビゲーションを統合
 *
 * @description
 * 以下のフックを統合:
 * - useSearchFocusState: フォーカスインデックス管理
 * - useKeyboard（ナビゲーション部分）: 矢印キー、Home/End、Escapeの処理
 *
 * @example
 * ```tsx
 * const navigation = useSearchNavigation({
 *   resultsLength: results.length,
 *   onClose: handleClose,
 *   loop: true,
 *   resultsRef,
 *   getResultRef,
 * });
 *
 * <div {...navigation.containerProps}>...</div>
 * ```
 */
export const useSearchNavigation = ({
  resultsLength,
  onClose,
  onNavigate,
  loop = true,
  resultsRef,
  getResultRef,
}: UseSearchNavigationOptions): UseSearchNavigationReturn => {
  const router = useRouter();

  // ===== フォーカス管理 =====
  const { focusedIndex, setFocusedIndex, resetFocus, moveUp, moveDown, moveToFirst, moveToLast } = useSearchFocusState({
    resultsLength,
    loop,
  });

  // ===== キーボードナビゲーション =====
  const { keyboardProps } = useKeyboard({
    onKeyDown: (e) => {
      const target = e.target;
      if (!isHTMLElement(target)) return;

      // 検索コンテキスト内のみで動作
      const isSearchContext =
        (target.tagName === 'INPUT' && target.getAttribute('role') === 'searchbox') ||
        target.closest('[data-search-results]') !== null;

      if (!isSearchContext) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          moveDown();
          if (onNavigate) onNavigate(focusedIndex);
          break;

        case 'ArrowUp':
          e.preventDefault();
          moveUp();
          if (onNavigate) onNavigate(focusedIndex);
          break;

        case 'Home':
          e.preventDefault();
          moveToFirst();
          break;

        case 'End':
          e.preventDefault();
          moveToLast();
          break;

        case 'Enter': {
          e.preventDefault();
          const currentIndex = focusedIndex;
          const results = resultsRef.current;
          if (!results || currentIndex < 0 || currentIndex >= results.length) {
            break;
          }

          const resultElement = getResultRef(currentIndex);
          if (resultElement) {
            const anchor = resultElement.querySelector('a');
            if (anchor) {
              anchor.click();
              break;
            }
          }

          // フォールバック: DOM取得失敗時の代替処理
          const result = results[currentIndex];
          if (result) {
            router.push(convertPostSlugToPath(result.slug));
            onClose();
          }
          break;
        }

        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    },
  });

  return {
    focusedIndex,
    setFocusedIndex,
    resetFocus,
    containerProps: keyboardProps,
  };
};
