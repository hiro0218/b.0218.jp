'use client';

import { useEffect } from 'react';
import smoothScroll from '@/lib/browser/smoothScroll';

export const BrowserEffects = () => {
  useEffect(() => {
    return smoothScroll();
  }, []);

  return null;
};
