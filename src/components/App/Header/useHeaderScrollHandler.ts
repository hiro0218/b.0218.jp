import throttle from '@/lib/throttle';
import { SPACING_BASE_PX } from '@/ui/styled/constant';
import { useEffect, useRef, useState } from 'react';

export const useHeaderScrollHandler = (): boolean => {
  const [isHeaderVisible, setIsHeaderVisible] = useState<boolean | null>(null);
  const previousScrollY = useRef<number>(typeof window !== 'undefined' ? window.scrollY : 0);
  const headerThreshold = useRef<number>(SPACING_BASE_PX * 8);

  useEffect(() => {
    const abortController = new AbortController();
    const { signal } = abortController;

    const handleScroll = throttle(() => {
      const currentScrollY = window.scrollY;

      // 指定の高さを超えた場合
      if (currentScrollY < previousScrollY.current) {
        setIsHeaderVisible(true);
      } else if (currentScrollY > headerThreshold.current && currentScrollY > previousScrollY.current) {
        setIsHeaderVisible(false);
      }

      // 今回のスクロール位置を保存
      previousScrollY.current = currentScrollY;
    });

    document.addEventListener('scroll', handleScroll, { signal, passive: true });
    return () => abortController.abort();
  }, []);

  return isHeaderVisible;
};
