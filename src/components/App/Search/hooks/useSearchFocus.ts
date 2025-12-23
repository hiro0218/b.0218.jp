import { type RefObject, useCallback, useRef, useState } from 'react';

export interface UseSearchFocusReturn {
  // フォーカス状態
  focusedIndex: number;
  setFocusedIndex: (index: number) => void;
  navigateToIndex: (index: number) => void;
  resetFocus: () => void;
  moveUp: () => void;
  moveDown: () => void;

  // DOM参照
  dialogRef: RefObject<HTMLDialogElement | null>;
  inputRef: RefObject<HTMLInputElement | null>;
  updateDOMRefs: () => void;

  // DOM操作
  focusInput: () => void;
  scrollToFocusedElement: (targetElement: HTMLElement) => void;

  // 検索結果要素参照
  setResultRef: (index: number, element: HTMLDivElement | null) => void;
  getResultRef: (index: number) => HTMLDivElement | undefined;
  clearResultRefs: () => void;
  clearExcessRefs: (maxSize: number) => void;
}

interface UseSearchFocusProps {
  resultsLength: number;
  dialogRef?: RefObject<HTMLDialogElement>;
}

/**
 * 検索のフォーカス管理を統合
 *
 * @description
 * 以下の3つの責務を統合:
 * 1. フォーカスインデックスの状態管理
 * 2. DOM参照と操作（入力フォーカス、スクロール）
 * 3. 検索結果要素への参照管理
 */
export const useSearchFocus = ({ resultsLength, dialogRef }: UseSearchFocusProps): UseSearchFocusReturn => {
  // ===== フォーカス状態管理 =====
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const navigateToIndex = useCallback(
    (index: number) => {
      setFocusedIndex((prev) => {
        const maxIndex = resultsLength - 1;
        if (index >= -1 && index <= maxIndex) {
          return index;
        }
        return prev;
      });
    },
    [resultsLength],
  );

  const resetFocus = useCallback(() => {
    setFocusedIndex(-1);
  }, []);

  const moveUp = useCallback(() => {
    setFocusedIndex((prev) => (prev > -1 ? prev - 1 : resultsLength - 1));
  }, [resultsLength]);

  const moveDown = useCallback(() => {
    setFocusedIndex((prev) => (prev < resultsLength - 1 ? prev + 1 : -1));
  }, [resultsLength]);

  // ===== DOM参照管理 =====
  const internalDialogRef = useRef<HTMLDialogElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const searchResultsRef = useRef<HTMLElement | null>(null);
  const actualDialogRef = dialogRef || internalDialogRef;

  const updateDOMRefs = useCallback(() => {
    const dialog = actualDialogRef.current;

    if (dialog) {
      internalDialogRef.current = dialog;
      const input = dialog.querySelector('input[role="searchbox"]') as HTMLInputElement;
      const results = dialog.querySelector('[data-search-results]') as HTMLElement;

      if (input) inputRef.current = input;
      if (results) searchResultsRef.current = results;
    }
  }, [actualDialogRef]);

  // ===== DOM操作 =====
  const focusInput = useCallback(() => {
    const input = inputRef.current;
    const container = searchResultsRef.current;
    const dialog = actualDialogRef.current;

    if (input && container && dialog?.open) {
      input.focus();
      container.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [actualDialogRef]);

  const scrollToFocusedElement = useCallback((targetElement: HTMLElement) => {
    const searchResultsContainer = searchResultsRef.current;
    if (!searchResultsContainer) return;

    const measurements = {
      containerRect: searchResultsContainer.getBoundingClientRect(),
      elementRect: targetElement.getBoundingClientRect(),
      elementOffsetTop: targetElement.offsetTop,
      containerHeight: searchResultsContainer.clientHeight,
      elementHeight: targetElement.offsetHeight,
    };

    const isAboveContainer = measurements.elementRect.top < measurements.containerRect.top;
    const isBelowContainer = measurements.elementRect.bottom > measurements.containerRect.bottom;

    if (isAboveContainer || isBelowContainer) {
      const scrollTop = isAboveContainer
        ? measurements.elementOffsetTop - 8
        : measurements.elementOffsetTop - measurements.containerHeight + measurements.elementHeight + 8;

      searchResultsContainer.scrollTo({
        top: scrollTop,
        behavior: 'smooth',
      });
    }
  }, []);

  // ===== 検索結果要素参照管理 =====
  const resultRefs = useRef(new Map<number, HTMLDivElement>());

  const setResultRef = useCallback((index: number, element: HTMLDivElement | null) => {
    if (element) {
      resultRefs.current.set(index, element);
    } else {
      resultRefs.current.delete(index);
    }
  }, []);

  const getResultRef = useCallback((index: number) => {
    return resultRefs.current.get(index);
  }, []);

  const clearResultRefs = useCallback(() => {
    resultRefs.current.clear();
  }, []);

  const clearExcessRefs = useCallback((maxSize: number) => {
    const currentSize = resultRefs.current.size;
    if (currentSize > maxSize) {
      for (let i = maxSize; i < currentSize; i++) {
        resultRefs.current.delete(i);
      }
    }
  }, []);

  return {
    // フォーカス状態
    focusedIndex,
    setFocusedIndex,
    navigateToIndex,
    resetFocus,
    moveUp,
    moveDown,

    // DOM参照
    dialogRef: actualDialogRef,
    inputRef,
    updateDOMRefs,

    // DOM操作
    focusInput,
    scrollToFocusedElement,

    // 検索結果要素参照
    setResultRef,
    getResultRef,
    clearResultRefs,
    clearExcessRefs,
  };
};
