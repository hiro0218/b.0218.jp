import { type RefObject, useCallback, useRef } from 'react';

export interface UseSearchDOMReturn {
  dialogRef: RefObject<HTMLDialogElement | null>;
  inputRef: RefObject<HTMLInputElement | null>;
  updateDOMRefs: () => void;
  focusInput: () => void;
  scrollToFocusedElement: (targetElement: HTMLElement) => void;
}

interface UseSearchDOMProps {
  dialogRef?: RefObject<HTMLDialogElement>;
}

/**
 * 検索ダイアログのDOM参照と操作を管理
 * dialog、input、検索結果コンテナへの参照とフォーカス・スクロール操作を提供
 */
export const useSearchDOM = ({ dialogRef }: UseSearchDOMProps = {}): UseSearchDOMReturn => {
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

  return {
    dialogRef: actualDialogRef,
    inputRef,
    updateDOMRefs,
    focusInput,
    scrollToFocusedElement,
  };
};
