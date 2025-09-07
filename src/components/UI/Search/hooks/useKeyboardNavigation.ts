import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { convertPostSlugToPath } from '@/lib/url';
import type { SearchProps } from '../types';

interface UseKeyboardNavigationProps {
  onNavigate: (index: number) => void;
  onClose: () => void;
  focusedIndexRef: { current: number };
  resultsRef: { current: SearchProps[] };
}

/**
 * キーボードナビゲーション機能を提供するカスタムフック
 * 検索結果の上下移動、選択、エスケープ処理を管理
 */
export const useKeyboardNavigation = ({
  onNavigate,
  onClose,
  focusedIndexRef,
  resultsRef,
}: UseKeyboardNavigationProps) => {
  const router = useRouter();

  // キーボードハンドラーをメモ化
  const keyHandlers = useMemo(
    () => ({
      // biome-ignore lint/style/useNamingConvention: キーボードイベントのkey値と一致させる必要がある
      ArrowDown: () => {
        const currentIndex = focusedIndexRef.current;
        const count = resultsRef.current.length;
        if (count > 0 && currentIndex < count - 1) {
          onNavigate(currentIndex + 1);
        }
      },
      // biome-ignore lint/style/useNamingConvention: キーボードイベントのkey値と一致させる必要がある
      ArrowUp: () => {
        const currentIndex = focusedIndexRef.current;
        if (currentIndex >= 0) {
          onNavigate(currentIndex - 1);
        }
      },
      // biome-ignore lint/style/useNamingConvention: キーボードイベントのkey値と一致させる必要がある
      Enter: () => {
        const currentIndex = focusedIndexRef.current;
        const count = resultsRef.current.length;
        if (currentIndex >= 0 && currentIndex < count) {
          const result = resultsRef.current[currentIndex];
          if (result) {
            router.push(convertPostSlugToPath(result.slug));
            onClose();
          }
        }
      },
      // biome-ignore lint/style/useNamingConvention: キーボードイベントのkey値と一致させる必要がある
      Escape: onClose,
    }),
    [onNavigate, onClose, router, focusedIndexRef, resultsRef],
  );

  // キーダウンイベントの処理
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isSearchContext =
        (target.tagName === 'INPUT' && target.getAttribute('role') === 'searchbox') ||
        target.closest('[data-search-results]') !== null;

      if (!isSearchContext) return;

      const handler = keyHandlers[e.key as keyof typeof keyHandlers];
      if (handler) {
        e.preventDefault();
        handler();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [keyHandlers]);

  // このフックは副作用のみ提供し、値は返却しない
  return {};
};
