'use client';

import type { RefObject } from 'react';
import { useCallback, useEffect } from 'react';

import { DEFAULT_TRANSITION_MS, FALLBACK_MARGIN_MS } from '@/constants/animation';
import { useTimeout } from '@/hooks/useTimeout';
import { useTransitionDuration } from '@/hooks/useTransitionDuration';

import type { ModalState } from './useImageZoom';

interface UseImageZoomTransitionOptions {
  modalImgRef: RefObject<HTMLImageElement | null>;
  modalState: ModalState;
  onTransitionEnd: () => void;
}

/**
 * onTransitionEnd のフォールバックタイマーを管理します。
 */
export function useImageZoomTransition({
  modalImgRef,
  modalState,
  onTransitionEnd,
}: UseImageZoomTransitionOptions): void {
  const { schedule, cancel } = useTimeout();
  const getTransitionDuration = useTransitionDuration(modalImgRef);

  const scheduleTransitionFallback = useCallback(() => {
    const durationMs = getTransitionDuration();
    const delay = durationMs === 0 ? 0 : Math.max(durationMs + FALLBACK_MARGIN_MS, DEFAULT_TRANSITION_MS);

    schedule(onTransitionEnd, delay);
  }, [getTransitionDuration, onTransitionEnd, schedule]);

  useEffect(() => {
    const isTransitioning = modalState === 'LOADING' || modalState === 'UNLOADING';

    if (isTransitioning) {
      scheduleTransitionFallback();
    } else {
      cancel();
    }
  }, [modalState, scheduleTransitionFallback, cancel]);
}
