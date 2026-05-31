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
      <input aria-expanded="true" aria-label="検索キーワード" role="combobox" />
      <div data-search-results />
    </dialog>
  );
}

describe('useSearchDOMRefs', () => {
  it('combobox の入力欄を検索入力として取得して focus する', () => {
    Object.defineProperty(HTMLElement.prototype, 'scrollTo', {
      configurable: true,
      value: vi.fn(),
    });

    render(<SearchDOMRefsHarness />);

    expect(document.activeElement).toBe(screen.getByRole('combobox', { name: '検索キーワード' }));
  });
});
