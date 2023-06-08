import { useState } from 'react';

import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect';

type ReturnType = [boolean, (locked: boolean) => void];

export function useLockedBody(initialLocked = false): ReturnType {
  const [isLocked, setIsLocked] = useState(initialLocked);

  useIsomorphicLayoutEffect(() => {
    let originalOverflow: string;
    let originalPaddingRight: string;
    let scrollBarWidth: number;

    if (isLocked) {
      originalOverflow = document.body.style.overflow;
      originalPaddingRight = document.body.style.paddingRight;

      document.body.style.overflow = 'hidden';

      const root = document.getElementById('__next');
      scrollBarWidth = root ? root.offsetWidth - root.scrollWidth : 0;

      if (scrollBarWidth) {
        document.body.style.paddingRight = `${scrollBarWidth}px`;
      }
    }

    return () => {
      if (isLocked) {
        document.body.style.overflow = originalOverflow;

        if (scrollBarWidth) {
          document.body.style.paddingRight = originalPaddingRight;
        }
      }
    };
  }, [isLocked]);

  return [isLocked, setIsLocked];
}
