import { useEffect, useRef, useState } from 'react';

import throttle from '@/lib/throttle';
import { SPACING_BASE_PX } from '@/ui/styled/constant';

export const useHeaderScrollHandler = () => {
  const [isHeaderShown, setIsHeaderShown] = useState<boolean | null>(null);
  const previousYPosition = useRef<number>(typeof window !== 'undefined' ? window.scrollY : 0);
  const headerHeight = SPACING_BASE_PX * 8;

  useEffect(() => {
    const abortController = new AbortController();
    const { signal } = abortController;

    const handleScroll = throttle(() => {
      const currentScrollY = window.scrollY;

      // 指定の高さを超えた場合
      if (currentScrollY < previousYPosition.current) {
        setIsHeaderShown(true);
      } else if (currentScrollY > headerHeight && currentScrollY > previousYPosition.current) {
        setIsHeaderShown(false);
      }

      // 今回のスクロール位置を残す
      previousYPosition.current = currentScrollY;
    });

    document.addEventListener('scroll', handleScroll, { signal, passive: true });
    return () => abortController.abort();
  }, [headerHeight, previousYPosition]);

  return isHeaderShown;
};
