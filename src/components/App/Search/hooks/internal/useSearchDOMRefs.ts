import { type RefObject, useCallback, useRef } from 'react';

interface UseSearchDOMRefsProps {
  dialogRef?: RefObject<HTMLDialogElement>;
}

const toPixels = (value: string) => {
  const pixels = Number.parseFloat(value);
  return Number.isFinite(pixels) ? pixels : 0;
};

const getScrollPadding = (container: HTMLElement) => {
  const styles = getComputedStyle(container);

  return {
    blockStart: toPixels(styles.scrollPaddingBlockStart || styles.scrollPaddingTop),
    blockEnd: toPixels(styles.scrollPaddingBlockEnd || styles.scrollPaddingBottom),
  };
};

export const useSearchDOMRefs = ({ dialogRef }: UseSearchDOMRefsProps) => {
  const internalDialogRef = useRef<HTMLDialogElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const searchResultsRef = useRef<HTMLElement | null>(null);
  const actualDialogRef = dialogRef || internalDialogRef;
  const resultRefsStore = useRef<Map<number, HTMLDivElement> | null>(null);
  if (resultRefsStore.current === null) {
    resultRefsStore.current = new Map<number, HTMLDivElement>();
  }
  const resultRefs = resultRefsStore.current;

  const updateDOMRefs = useCallback(() => {
    const dialog = actualDialogRef.current;
    if (!dialog) return;

    internalDialogRef.current = dialog;

    if (!inputRef.current?.isConnected) {
      const input = dialog.querySelector<HTMLInputElement>(
        'input[type="search"], input[role="searchbox"], input[role="combobox"]',
      );
      if (input) inputRef.current = input;
    }

    // searchResults は条件付きレンダリングのため、要素が存在しない場合は null を許容
    if (!searchResultsRef.current?.isConnected) {
      searchResultsRef.current = dialog.querySelector<HTMLElement>('[data-search-results]');
    }
  }, [actualDialogRef]);

  const focusInput = useCallback(() => {
    const input = inputRef.current;
    const dialog = actualDialogRef.current;

    if (input && dialog?.open) {
      input.focus({ preventScroll: true });
    }
  }, [actualDialogRef]);

  const resetResultScroll = useCallback(() => {
    searchResultsRef.current?.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  const scrollToFocusedElement = useCallback((targetElement: HTMLElement) => {
    const container = targetElement.closest<HTMLElement>('[data-search-results]') ?? searchResultsRef.current;
    if (!container) return;

    searchResultsRef.current = container;

    const containerRect = container.getBoundingClientRect();
    const targetRect = targetElement.getBoundingClientRect();
    const padding = getScrollPadding(container);
    const upperEdge = containerRect.top + padding.blockStart;
    const lowerEdge = containerRect.bottom - padding.blockEnd;
    const isAboveViewport = targetRect.top < upperEdge;
    const isBelowViewport = targetRect.bottom > lowerEdge;

    if (!isAboveViewport && !isBelowViewport) return;

    const scrollOffset = isAboveViewport ? targetRect.top - upperEdge : targetRect.bottom - lowerEdge;
    container.scrollTo({ top: container.scrollTop + scrollOffset, behavior: 'auto' });
  }, []);

  const setResultRef = useCallback(
    (index: number, element: HTMLDivElement | null) => {
      if (element) {
        resultRefs.set(index, element);
      } else {
        resultRefs.delete(index);
      }
    },
    [resultRefs],
  );

  const getResultRef = useCallback(
    (index: number) => {
      return resultRefs.get(index);
    },
    [resultRefs],
  );

  const clearExcessRefs = useCallback(
    (maxSize: number) => {
      const currentSize = resultRefs.size;
      if (currentSize <= maxSize) return;

      for (let i = maxSize; i < currentSize; i++) {
        resultRefs.delete(i);
      }
    },
    [resultRefs],
  );

  return {
    updateDOMRefs,
    focusInput,
    resetResultScroll,
    scrollToFocusedElement,
    setResultRef,
    getResultRef,
    clearExcessRefs,
  };
};
