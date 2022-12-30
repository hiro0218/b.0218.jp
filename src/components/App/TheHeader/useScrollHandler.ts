import { useEffect, useState } from 'react';

import { theme } from '@/ui/themes';

export const useScrollHandler = () => {
  const [isHeaderShown, setIsHeaderShown] = useState(true);

  useEffect(() => {
    const headerHeight = theme.components.header.height;
    let ticking = false;
    let lastScrollY = 0;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (!ticking) {
        requestAnimationFrame(() => {
          ticking = false;

          // ヘッダーの高さを超えた場合
          if (currentScrollY >= headerHeight) {
            setIsHeaderShown(currentScrollY <= lastScrollY);
          } else {
            setIsHeaderShown(true);
          }

          // 今回のスクロール位置を残す
          lastScrollY = currentScrollY;
        });
      }

      ticking = true;
    };

    document.addEventListener('scroll', handleScroll);
    () => document.removeEventListener('scroll', handleScroll);
  }, []);

  return isHeaderShown;
};
