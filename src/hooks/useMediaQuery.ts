'use client';

import { useCallback, useEffect, useState } from 'react';
import { isSSR } from '@/lib/browser/isSSR';

/**
 * メディアクエリの一致を監視します。
 */
export function useMediaQuery(query: string, defaultValue = false): boolean {
  const [matches, setMatches] = useState(defaultValue);

  const handleChange = useCallback((event: MediaQueryListEvent): void => {
    setMatches(event.matches);
  }, []);

  useEffect(() => {
    if (isSSR) return;

    const mediaQueryList = window.matchMedia(query);
    setMatches(mediaQueryList.matches);

    mediaQueryList.addEventListener('change', handleChange);
    return () => {
      mediaQueryList.removeEventListener('change', handleChange);
    };
  }, [query, handleChange]);

  return matches;
}
