'use client';

import { type ReactNode, useLayoutEffect, useRef } from 'react';
import debounce from '@/lib/debounce';
import observeScrollbarWidth from '@/lib/observeScrollbarWidth';
import smoothScroll from '@/lib/smoothScroll';

type Props = {
  children: ReactNode;
};

export default function Template({ children }: Props) {
  const debouncedObserveScrollbarWidth = useRef<() => void>(debounce(observeScrollbarWidth, 250));
  const smoothScrollCleanupRef = useRef<(() => void) | null>(null);

  useLayoutEffect(() => {
    // 同じ参照を使用してリスナーの追加と削除を保証
    const handleResize = debouncedObserveScrollbarWidth.current;

    // smoothScrollとobserveScrollbarWidthを即座に初期化
    smoothScrollCleanupRef.current = smoothScroll();
    observeScrollbarWidth();

    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      window.removeEventListener('resize', handleResize);

      if (smoothScrollCleanupRef.current) {
        smoothScrollCleanupRef.current();
      }
    };
  }, []);

  return <>{children}</>;
}
