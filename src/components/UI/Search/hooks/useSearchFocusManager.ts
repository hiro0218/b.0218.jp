import { type RefObject, useCallback, useEffect, useRef, useState } from 'react';

export type SearchFocusManagerReturn = {
  state: {
    focusedIndex: number;
    setFocusedIndex: (index: number) => void;
    navigateToIndex: (index: number) => void;
    resetFocus: () => void;
    resetAll: () => void;
    moveUp: () => void;
    moveDown: () => void;
  };
  dom: {
    updateDOMRefs: () => void;
    focusInput: () => void;
    scrollToFocusedElement: (targetElement: HTMLElement) => void;
    dialogRef: RefObject<HTMLDialogElement | null>;
    inputRef: RefObject<HTMLInputElement | null>;
  };
  results: {
    setResultRef: (index: number, element: HTMLDivElement | null) => void;
    getResultRef: (index: number) => HTMLDivElement | undefined;
    clearResultRefs: () => void;
    clearExcessRefs: (maxSize: number) => void;
  };
};

type UseSearchFocusManagerProps = {
  resultsLength: number;
  dialogRef?: RefObject<HTMLDialogElement>;
};

/**
 * 検索コンポーネントのフォーカス管理を統合的に行うフック
 *
 * DOM参照管理、フォーカス状態、キーボードナビゲーション、参照クリーンアップを
 * 単一のフックに統合し、関連する機能を一箇所で管理する
 *
 * @param resultsLength - 現在の検索結果数
 * @param dialogRef - 外部からのダイアログ参照（オプション）
 * @returns フォーカス管理に必要な全ての機能
 */
export const useSearchFocusManager = ({
  resultsLength,
  dialogRef,
}: UseSearchFocusManagerProps): SearchFocusManagerReturn => {
  const internalDialogRef = useRef<HTMLDialogElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const searchResultsRef = useRef<HTMLElement | null>(null);
  const actualDialogRef = dialogRef || internalDialogRef;

  const [focusedIndex, setFocusedIndex] = useState(-1);

  const resultRefs = useRef(new Map<number, HTMLDivElement>());

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

  const resetAll = useCallback(() => {
    setFocusedIndex(-1);
    clearResultRefs();
    focusInput();
  }, [clearResultRefs, focusInput]);

  useEffect(() => {
    if (focusedIndex === -1) {
      focusInput();
      return;
    }

    const targetElement = getResultRef(focusedIndex);
    if (targetElement) {
      targetElement.focus();
      scrollToFocusedElement(targetElement);
    }
  }, [focusedIndex, getResultRef, focusInput, scrollToFocusedElement]);

  useEffect(() => {
    updateDOMRefs();
    clearExcessRefs(resultsLength);

    return () => {
      if (resultsLength === 0) {
        clearResultRefs();
      }
    };
  }, [resultsLength, clearExcessRefs, clearResultRefs, updateDOMRefs]);

  return {
    state: {
      focusedIndex,
      setFocusedIndex,
      navigateToIndex,
      resetFocus,
      resetAll,
      moveUp,
      moveDown,
    },
    dom: {
      updateDOMRefs,
      focusInput,
      scrollToFocusedElement,
      dialogRef: actualDialogRef,
      inputRef,
    },
    results: {
      setResultRef,
      getResultRef,
      clearResultRefs,
      clearExcessRefs,
    },
  };
};
