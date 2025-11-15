import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { useKeyboard } from 'react-aria';
import { isHTMLElement } from '@/lib/browser/typeGuards';
import { convertPostSlugToPath } from '@/lib/utils/url';
import type { SearchProps } from '../types';

interface UseKeyboardNavigationProps {
  onNavigate: (index: number) => void;
  onClose: () => void;
  focusedIndexRef: { current: number };
  resultsRef: { current: SearchProps[] };
}

/**
 * キーボードナビゲーション機能を提供するカスタムフック
 * React Aria の useKeyboard を使用してアクセシビリティを向上
 * 検索結果の上下移動、選択、エスケープ処理を管理
 */
export const useKeyboardNavigation = ({
  onNavigate,
  onClose,
  focusedIndexRef,
  resultsRef,
}: UseKeyboardNavigationProps) => {
  const router = useRouter();

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
      const result = resultsRef.current[currentIndex];
      if (result) {
        router.push(convertPostSlugToPath(result.slug));
        onClose();
      }
    }
  }, [onClose, router, focusedIndexRef, resultsRef]);

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

  return {
    keyboardProps,
  };
};
