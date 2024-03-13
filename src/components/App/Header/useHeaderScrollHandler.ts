import { useEffect, useState } from 'react';

import throttle from '@/lib/throttle';
import { SPACING_BASE_PX } from '@/ui/styled/CssBaseline/Settings/Space';

export const useHeaderScrollHandler = () => {
  const [isHeaderShown, setIsHeaderShown] = useState(true);
  const headerHeight = SPACING_BASE_PX * 8;

  useEffect(() => {
    const abortController = new AbortController();
    const { signal } = abortController;
    let lastScrollY = 0;

    const handleScroll = throttle(() => {
      const currentScrollY = window.scrollY;

      // 指定の高さを超えた場合
      if (currentScrollY >= headerHeight) {
        setIsHeaderShown(currentScrollY <= lastScrollY);
      } else {
        setIsHeaderShown(true);
      }

      // 今回のスクロール位置を残す
      lastScrollY = currentScrollY;
    });

    document.addEventListener('scroll', handleScroll, { signal, passive: true });
    return () => abortController.abort();
  }, [headerHeight]);

  return isHeaderShown;
};
