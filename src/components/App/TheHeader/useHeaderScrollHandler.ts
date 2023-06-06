import { useEffect, useState } from 'react';

import { SPACING_BASE_PX } from '@/components/Functional/CssBaseline/Settings/Space';
import throttle from '@/lib/throttle';

export const useHeaderScrollHandler = () => {
  const [isHeaderShown, setIsHeaderShown] = useState(true);
  const headerHeight = SPACING_BASE_PX * 8;

  useEffect(() => {
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

    document.addEventListener('scroll', handleScroll, { passive: true });
    return () => document.removeEventListener('scroll', handleScroll);
  }, [headerHeight]);

  return isHeaderShown;
};
