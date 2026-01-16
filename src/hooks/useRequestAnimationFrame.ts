'use client';

import { useCallback, useEffect, useRef } from 'react';

interface UseRequestAnimationFrameReturn {
  schedule: (callback: () => void) => void;
  cancel: () => void;
  isPending: () => boolean;
}

/**
 * requestAnimationFrame を管理します。
 */
export function useRequestAnimationFrame(): UseRequestAnimationFrameReturn {
  const rafIdRef = useRef<number | null>(null);

  const cancel = useCallback(() => {
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
  }, []);

  const schedule = useCallback((callback: () => void) => {
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
    }
    rafIdRef.current = requestAnimationFrame(() => {
      rafIdRef.current = null;
      callback();
    });
  }, []);

  const isPending = useCallback(() => rafIdRef.current !== null, []);

  useEffect(() => cancel, [cancel]);

  return { schedule, cancel, isPending };
}
