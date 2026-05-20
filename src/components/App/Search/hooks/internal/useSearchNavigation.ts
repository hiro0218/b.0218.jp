import { useKeyboard } from '@react-aria/interactions';
import { useRouter } from 'next/navigation';
import { type RefObject, useCallback, useState } from 'react';
import { isHTMLElement, isInputElement } from '@/lib/browser/typeGuards';
import { convertPostSlugToPath } from '@/lib/utils/url';
import type { SearchResultItem } from '../../types';

export interface UseSearchNavigationOptions {
  resultsLength: number;
  onClose?: () => void;
  /** ループナビゲーションを有効化 (最後の次 → 最初、最初の前 → 最後) */
  loop?: boolean;
  resultsRef: RefObject<SearchResultItem[]>;
  getResultRef: (index: number) => HTMLDivElement | undefined;
}

export interface UseSearchNavigationReturn {
  focusedIndex: number;
  setFocusedIndex: (index: number) => void;
  resetFocus: () => void;
  containerProps: ReturnType<typeof useKeyboard>['keyboardProps'];
}

export const useSearchNavigation = ({
  resultsLength,
  onClose,
  loop = true,
  resultsRef,
  getResultRef,
}: UseSearchNavigationOptions): UseSearchNavigationReturn => {
  const router = useRouter();
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const resetFocus = useCallback(() => {
    setFocusedIndex(-1);
  }, []);

  const moveUp = useCallback(() => {
    setFocusedIndex((prev) => {
      if (loop) {
        return prev > -1 ? prev - 1 : resultsLength - 1;
      }
      return Math.max(-1, prev - 1);
    });
  }, [resultsLength, loop]);

  const moveDown = useCallback(() => {
    setFocusedIndex((prev) => {
      if (loop) {
        return prev < resultsLength - 1 ? prev + 1 : -1;
      }
      return Math.min(resultsLength - 1, prev + 1);
    });
  }, [resultsLength, loop]);

  const moveToFirst = useCallback(() => {
    setFocusedIndex(resultsLength > 0 ? 0 : -1);
  }, [resultsLength]);

  const moveToLast = useCallback(() => {
    setFocusedIndex(resultsLength > 0 ? resultsLength - 1 : -1);
  }, [resultsLength]);

  const { keyboardProps } = useKeyboard({
    onKeyDown: (e) => {
      const target = e.target;
      if (!isHTMLElement(target)) return;

      // 検索コンテキスト内のみで動作
      const isSearchContext =
        (isInputElement(target) && (target.type === 'search' || target.getAttribute('role') === 'searchbox')) ||
        target.closest('[data-search-results]') !== null;

      if (!isSearchContext) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          moveDown();
          break;

        case 'ArrowUp':
          e.preventDefault();
          moveUp();
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
            if (onClose) onClose();
          }
          break;
        }

        case 'Escape':
          e.preventDefault();
          if (onClose) onClose();
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
