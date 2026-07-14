import { useKeyboard } from '@react-aria/interactions';
import { useRouter } from 'next/navigation';
import { type RefObject, useCallback, useEffect, useRef, useState } from 'react';
import { isHTMLElement, isInputElement } from '@/lib/browser/typeGuards';
import { convertPostSlugToPath } from '@/lib/utils/url';
import { SEARCH_INPUT_SELECTOR, SEARCH_RESULTS_SELECTOR } from '../../constants';
import type { SearchResultItem } from '../../types';

export interface UseSearchNavigationOptions {
  resultsLength: number;
  onClose?: () => void;
  /** ループナビゲーションを有効化 (最後の次 → 最初、最初の前 → 最後) */
  loop?: boolean;
  resultsRef: RefObject<SearchResultItem[]>;
  onSubmitQuery?: (query: string) => void;
  onKeyboardNavigation?: () => void;
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
  onSubmitQuery,
  onKeyboardNavigation,
}: UseSearchNavigationOptions): UseSearchNavigationReturn => {
  const router = useRouter();
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const focusedIndexRef = useRef(focusedIndex);

  const commitFocusedIndex = useCallback((nextIndex: number) => {
    focusedIndexRef.current = nextIndex;
    setFocusedIndex(nextIndex);
  }, []);

  useEffect(() => {
    const currentIndex = focusedIndexRef.current;
    const nextIndex = resultsLength === 0 ? -1 : currentIndex >= resultsLength ? resultsLength - 1 : currentIndex;
    if (nextIndex !== currentIndex) {
      commitFocusedIndex(nextIndex);
    }
  }, [commitFocusedIndex, resultsLength]);

  const resetFocus = useCallback(() => {
    commitFocusedIndex(-1);
  }, [commitFocusedIndex]);

  const selectIndex = useCallback(
    (index: number) => {
      const nextIndex = resultsLength === 0 || index < 0 ? -1 : Math.min(index, resultsLength - 1);
      if (nextIndex === focusedIndexRef.current) return;
      commitFocusedIndex(nextIndex);
    },
    [commitFocusedIndex, resultsLength],
  );

  const moveUp = () => {
    onKeyboardNavigation?.();
    if (resultsLength === 0) {
      commitFocusedIndex(-1);
      return;
    }

    const currentIndex = focusedIndexRef.current;
    const nextIndex = loop
      ? currentIndex <= 0
        ? resultsLength - 1
        : currentIndex - 1
      : Math.max(-1, currentIndex - 1);
    commitFocusedIndex(nextIndex);
  };

  const moveDown = () => {
    onKeyboardNavigation?.();
    if (resultsLength === 0) {
      commitFocusedIndex(-1);
      return;
    }

    const currentIndex = focusedIndexRef.current;
    const nextIndex = loop
      ? currentIndex >= resultsLength - 1
        ? 0
        : currentIndex + 1
      : Math.min(resultsLength - 1, currentIndex + 1);
    commitFocusedIndex(nextIndex);
  };

  const moveToFirst = () => {
    onKeyboardNavigation?.();
    const nextIndex = resultsLength > 0 ? 0 : -1;
    commitFocusedIndex(nextIndex);
  };

  const moveToLast = () => {
    onKeyboardNavigation?.();
    const nextIndex = resultsLength > 0 ? resultsLength - 1 : -1;
    commitFocusedIndex(nextIndex);
  };

  const { keyboardProps } = useKeyboard({
    onKeyDown: (e) => {
      const target = e.target;
      if (!isHTMLElement(target)) return;
      if (e.nativeEvent.isComposing || e.nativeEvent.keyCode === 229) return;

      // SearchHeader の入力欄か検索結果リスト内でのみ発火させる（契約セレクタは constants.ts で一元管理）
      const isSearchContext = target.matches(SEARCH_INPUT_SELECTOR) || target.closest(SEARCH_RESULTS_SELECTOR) !== null;

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
          const currentIndex = focusedIndexRef.current;
          const results = resultsRef.current;
          if (!results || currentIndex < 0 || currentIndex >= results.length) {
            if (isInputElement(target)) {
              onSubmitQuery?.(target.value);
            }
            break;
          }

          const result = results[currentIndex];
          if (result) {
            router.push(convertPostSlugToPath(result.slug));
          }
          break;
        }

        case 'Escape':
          e.preventDefault();
          onClose?.();
          break;
      }
    },
  });

  return {
    focusedIndex,
    setFocusedIndex: selectIndex,
    resetFocus,
    containerProps: keyboardProps,
  };
};
