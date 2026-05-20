import { render, screen } from '@testing-library/react';
import { type RefObject, useLayoutEffect, useRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
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
      <input aria-label="検索キーワード" type="search" />
      <div data-search-results />
    </dialog>
  );
}

describe('useSearchDOMRefs', () => {
  it('type="search" の入力欄を検索入力として取得して focus する', () => {
    Object.defineProperty(HTMLElement.prototype, 'scrollTo', {
      configurable: true,
      value: vi.fn(),
    });

    render(<SearchDOMRefsHarness />);

    expect(document.activeElement).toBe(screen.getByRole('searchbox', { name: '検索キーワード' }));
  });
});
