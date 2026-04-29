'use client';

import { useLayoutEffect } from 'react';
import observeScrollbarWidth from '@/lib/browser/observeScrollbarWidth';
import smoothScroll from '@/lib/browser/smoothScroll';
import debounce from '@/lib/utils/debounce';

export const BrowserEffects = () => {
  useLayoutEffect(() => {
    const cleanupSmoothScroll = smoothScroll();
    const handleResize = debounce(observeScrollbarWidth, 250);

    observeScrollbarWidth();
    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      window.removeEventListener('resize', handleResize);
      cleanupSmoothScroll();
    };
  }, []);

  return null;
};
