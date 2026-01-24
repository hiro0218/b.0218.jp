'use client';

import { useCallback, useRef } from 'react';

import { useRequestAnimationFrame } from './useRequestAnimationFrame';

interface UseDoubleRafReturn {
  schedule: (firstFrame: () => void, secondFrame: () => void) => void;
  cancel: () => void;
  isPending: () => boolean;
}

/**
 * 2段階の requestAnimationFrame を管理します。
 */
export function useDoubleRaf(): UseDoubleRafReturn {
  const firstRaf = useRequestAnimationFrame();
  const secondRaf = useRequestAnimationFrame();
  const isScheduledRef = useRef(false);

  const cancel = useCallback(() => {
    firstRaf.cancel();
    secondRaf.cancel();
    isScheduledRef.current = false;
  }, [firstRaf, secondRaf]);

  const schedule = useCallback(
    (firstFrame: () => void, secondFrame: () => void) => {
      cancel();
      isScheduledRef.current = true;

      firstRaf.schedule(() => {
        firstFrame();
        secondRaf.schedule(() => {
          secondFrame();
          isScheduledRef.current = false;
        });
      });
    },
    [cancel, firstRaf, secondRaf],
  );

  const isPending = useCallback(() => isScheduledRef.current, []);

  return { schedule, cancel, isPending };
}
