'use client';

import { useCallback, useEffect, useRef } from 'react';

interface UseTimeoutReturn {
  schedule: (callback: () => void, delay: number) => void;
  cancel: () => void;
  isPending: () => boolean;
}

/**
 * setTimeout を管理します。
 */
export function useTimeout(): UseTimeoutReturn {
  const timeoutIdRef = useRef<number | null>(null);

  const cancel = useCallback(() => {
    if (timeoutIdRef.current !== null) {
      window.clearTimeout(timeoutIdRef.current);
      timeoutIdRef.current = null;
    }
  }, []);

  const schedule = useCallback((callback: () => void, delay: number) => {
    if (timeoutIdRef.current !== null) {
      window.clearTimeout(timeoutIdRef.current);
    }
    timeoutIdRef.current = window.setTimeout(() => {
      timeoutIdRef.current = null;
      callback();
    }, delay);
  }, []);

  const isPending = useCallback(() => timeoutIdRef.current !== null, []);

  useEffect(() => cancel, [cancel]);

  return { schedule, cancel, isPending };
}
