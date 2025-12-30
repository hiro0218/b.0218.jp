import { type RefObject, useCallback, useRef } from 'react';

export interface UseSearchDOMRefsReturn {
  dialogRef: RefObject<HTMLDialogElement | null>;
  inputRef: RefObject<HTMLInputElement | null>;
  updateDOMRefs: () => void;
  focusInput: () => void;
  scrollToFocusedElement: (targetElement: HTMLElement) => void;
  setResultRef: (index: number, element: HTMLDivElement | null) => void;
  getResultRef: (index: number) => HTMLDivElement | undefined;
  clearResultRefs: () => void;
  clearExcessRefs: (maxSize: number) => void;
}

interface UseSearchDOMRefsProps {
  dialogRef?: RefObject<HTMLDialogElement>;
}

/**
 * 検索UI用のDOM参照と操作を管理
 * @description
 * 以下の3つの責務を統合:
 * 1. DOM参照管理（dialog, input, searchResults）
 * 2. DOM操作（入力フォーカス、スクロール）
 * 3. 検索結果要素への参照管理（Map）
 */
export const useSearchDOMRefs = ({ dialogRef }: UseSearchDOMRefsProps): UseSearchDOMRefsReturn => {
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
    dialogRef: actualDialogRef,
    inputRef,
    updateDOMRefs,
    focusInput,
    scrollToFocusedElement,
    setResultRef,
    getResultRef,
    clearResultRefs,
    clearExcessRefs,
  };
};
