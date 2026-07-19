import { render, screen } from '@testing-library/react';
import { type RefObject, useLayoutEffect, useRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { SEARCH_RESULTS_MARKER_PROPS } from '../../constants';
import { useSearchDOMRefs } from './useSearchDOMRefs';

function SearchDOMRefsHarness() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const { updateDOMRefs, focusInput } = useSearchDOMRefs({ dialogRef: dialogRef as RefObject<HTMLDialogElement> });

  useLayoutEffect(() => {
    updateDOMRefs();
    focusInput();
  }, [focusInput, updateDOMRefs]);

  return (
    <dialog open ref={dialogRef}>
      <input aria-expanded="true" aria-label="検索キーワード" role="combobox" />
      <div {...SEARCH_RESULTS_MARKER_PROPS} />
    </dialog>
  );
}

function SearchResultScrollHarness() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const { updateDOMRefs, resetResultScroll } = useSearchDOMRefs({
    dialogRef: dialogRef as RefObject<HTMLDialogElement>,
  });

  useLayoutEffect(() => {
    updateDOMRefs();
    resetResultScroll();
  }, [resetResultScroll, updateDOMRefs]);

  return (
    <dialog open ref={dialogRef}>
      <input aria-expanded="true" aria-label="検索キーワード" role="combobox" />
      <div {...SEARCH_RESULTS_MARKER_PROPS} />
    </dialog>
  );
}

const createRect = ({ bottom, top }: { bottom: number; top: number }): DOMRect => ({
  bottom,
  height: bottom - top,
  left: 0,
  right: 100,
  toJSON: () => ({}),
  top,
  width: 100,
  x: 0,
  y: top,
});

function SearchFocusedElementScrollHarness() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLDivElement>(null);
  const { updateDOMRefs, scrollToFocusedElement } = useSearchDOMRefs({
    dialogRef: dialogRef as RefObject<HTMLDialogElement>,
  });

  useLayoutEffect(() => {
    const container = containerRef.current;
    const target = targetRef.current;
    if (!container || !target) return;

    container.scrollTop = 100;
    container.getBoundingClientRect = () => createRect({ top: 0, bottom: 200 });
    target.getBoundingClientRect = () => createRect({ top: 220, bottom: 260 });

    updateDOMRefs();
    scrollToFocusedElement(target);
  }, [scrollToFocusedElement, updateDOMRefs]);

  return (
    <dialog open ref={dialogRef}>
      <input aria-expanded="true" aria-label="検索キーワード" role="combobox" />
      <div {...SEARCH_RESULTS_MARKER_PROPS} ref={containerRef}>
        <div ref={targetRef} />
      </div>
    </dialog>
  );
}

describe('useSearchDOMRefs', () => {
  it('combobox の入力欄を検索入力として取得して focus する', () => {
    const scrollTo = vi.fn();
    Object.defineProperty(HTMLElement.prototype, 'scrollTo', {
      configurable: true,
      value: scrollTo,
    });

    render(<SearchDOMRefsHarness />);

    expect(document.activeElement).toBe(screen.getByRole('combobox', { name: '検索キーワード' }));
    expect(scrollTo).not.toHaveBeenCalled();
  });

  it('検索結果リストのスクロールリセットを入力 focus とは分離する', () => {
    const scrollTo = vi.fn();
    Object.defineProperty(HTMLElement.prototype, 'scrollTo', {
      configurable: true,
      value: scrollTo,
    });

    render(<SearchResultScrollHarness />);

    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'auto' });
  });

  it('選択項目が下にはみ出したら検索結果リスト自体をスクロールする', () => {
    const scrollTo = vi.fn();
    Object.defineProperty(HTMLElement.prototype, 'scrollTo', {
      configurable: true,
      value: scrollTo,
    });

    render(<SearchFocusedElementScrollHarness />);

    expect(scrollTo).toHaveBeenCalledWith({ top: 160, behavior: 'auto' });
  });
});
