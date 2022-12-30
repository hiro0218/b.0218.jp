import { useEffect, useState } from 'react';

import throttle from '@/lib/throttle';
import { theme } from '@/ui/themes';

export const useHeaderScrollHandler = () => {
  const [isHeaderShown, setIsHeaderShown] = useState(true);

  useEffect(() => {
    const headerHeight = theme.components.header.height;
    let lastScrollY = 0;

    const handleScroll = throttle(() => {
      const currentScrollY = window.scrollY;

      // ヘッダーの高さを超えた場合
      if (currentScrollY >= headerHeight) {
        setIsHeaderShown(currentScrollY <= lastScrollY);
      } else {
        setIsHeaderShown(true);
      }

      // 今回のスクロール位置を残す
      lastScrollY = currentScrollY;
    });

    document.addEventListener('scroll', handleScroll);
    () => document.removeEventListener('scroll', handleScroll);
  }, []);

  return isHeaderShown;
};
