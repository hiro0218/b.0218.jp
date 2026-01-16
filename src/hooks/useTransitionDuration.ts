'use client';

import type { RefObject } from 'react';
import { useCallback } from 'react';

import { DEFAULT_TRANSITION_MS } from '@/constants/animation';

/**
 * transition-duration をミリ秒で取得します。
 */
export function useTransitionDuration(elementRef: RefObject<HTMLElement | null>): () => number {
  const getTransitionDuration = useCallback(() => {
    const element = elementRef.current;
    if (!element) return DEFAULT_TRANSITION_MS;

    const computedStyle = window.getComputedStyle(element);
    const duration = computedStyle.transitionDuration.split(',')[0]?.trim() || '0s';
    const durationValue = Number.parseFloat(duration);

    if (!Number.isFinite(durationValue)) return DEFAULT_TRANSITION_MS;

    return durationValue * (duration.endsWith('ms') ? 1 : 1000);
  }, [elementRef]);

  return getTransitionDuration;
}
