import { useEffect, useState } from 'react';

import throttle from '@/lib/throttle';
import { useTheme } from '@/ui/styled';

export const useHeaderScrollHandler = () => {
  const [isHeaderShown, setIsHeaderShown] = useState(true);
  const theme = useTheme();
  const headerHeight = theme.components.header.height;

  useEffect(() => {
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
  }, [headerHeight]);

  return isHeaderShown;
};
