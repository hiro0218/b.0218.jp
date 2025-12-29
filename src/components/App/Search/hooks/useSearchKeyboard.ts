import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { useKeyboard } from 'react-aria';
import { isHTMLElement } from '@/lib/browser/typeGuards';
import { convertPostSlugToPath } from '@/lib/utils/url';
import type { SearchProps } from '../types';

const NAV_KEYS = new Set(['ArrowDown', 'ArrowUp', 'Enter', 'Escape'] as const);

interface UseSearchKeyboardProps {
  // キーボードナビゲーション
  onNavigate: (index: number) => void;
  onClose: () => void;
  focusedIndexRef: { current: number };
  resultsRef: { current: SearchProps[] };
  getResultRef: (index: number) => HTMLDivElement | undefined;

  // 検索入力
  currentQuery: string;
  executeSearch: (query: string) => void;
  debouncedSearch: (query: string) => void;
}

export interface UseSearchKeyboardReturn {
  keyboardProps: ReturnType<typeof useKeyboard>['keyboardProps'];
  handleSearchInput: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

/**
 * キーボード操作を統合管理
 *
 * @description
 * 以下の2つの責務を統合:
 * 1. キーボードナビゲーション（Arrow, Enter, Escape）
 * 2. 検索入力の特殊処理（Enter キーの即座実行、デバウンス）
 */
export const useSearchKeyboard = ({
  onNavigate,
  onClose,
  focusedIndexRef,
  resultsRef,
  getResultRef,
  currentQuery,
  executeSearch,
  debouncedSearch,
}: UseSearchKeyboardProps): UseSearchKeyboardReturn => {
  const router = useRouter();

  // ===== キーボードナビゲーション =====
  const handleArrowDown = useCallback(() => {
    const currentIndex = focusedIndexRef.current;
    const count = resultsRef.current.length;
    if (count > 0 && currentIndex < count - 1) {
      onNavigate(currentIndex + 1);
    }
  }, [onNavigate, focusedIndexRef, resultsRef]);

  const handleArrowUp = useCallback(() => {
    const currentIndex = focusedIndexRef.current;
    if (currentIndex >= 0) {
      onNavigate(currentIndex - 1);
    }
  }, [onNavigate, focusedIndexRef]);

  const handleEnter = useCallback(() => {
    const currentIndex = focusedIndexRef.current;
    const count = resultsRef.current.length;
    if (currentIndex >= 0 && currentIndex < count) {
      // DOM操作でネイティブクリックをトリガー（クリック時と同じ処理フロー）
      const resultElement = getResultRef(currentIndex);
      if (resultElement) {
        const anchor = resultElement.querySelector('a');
        if (anchor) {
          // anchor.click()内でonLinkClick(=onClose)が呼ばれるため、ここではonCloseを呼ばない
          anchor.click();
          return;
        }
      }

      // フォールバック: DOM取得失敗時の代替処理
      const result = resultsRef.current[currentIndex];
      if (result) {
        router.push(convertPostSlugToPath(result.slug));
        onClose();
      }
    }
  }, [onClose, router, focusedIndexRef, resultsRef, getResultRef]);

  const { keyboardProps } = useKeyboard({
    onKeyDown: (e) => {
      const target = e.target;
      if (!isHTMLElement(target)) return;

      const isSearchContext =
        (target.tagName === 'INPUT' && target.getAttribute('role') === 'searchbox') ||
        target.closest('[data-search-results]') !== null;

      if (!isSearchContext) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          handleArrowDown();
          break;
        case 'ArrowUp':
          e.preventDefault();
          handleArrowUp();
          break;
        case 'Enter':
          e.preventDefault();
          handleEnter();
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    },
  });

  // ===== 検索入力処理 =====
  const handleSearchInput = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!(e.currentTarget instanceof HTMLInputElement) || e.nativeEvent.isComposing) {
        return;
      }

      const value = e.currentTarget.value.trim();
      if (value === currentQuery) {
        return;
      }

      // Enter キーで入力にフォーカスがある場合（focusedIndex === -1）は即座実行
      if (e.key === 'Enter' && focusedIndexRef.current === -1) {
        executeSearch(value);
        return;
      }

      // ナビゲーションキー以外はデバウンス検索
      if (!NAV_KEYS.has(e.key as typeof NAV_KEYS extends Set<infer T> ? T : never)) {
        debouncedSearch(value);
      }
    },
    [currentQuery, focusedIndexRef, executeSearch, debouncedSearch],
  );

  return {
    keyboardProps,
    handleSearchInput,
  };
};
