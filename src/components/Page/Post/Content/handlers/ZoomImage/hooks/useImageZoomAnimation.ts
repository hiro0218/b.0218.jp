'use client';

import type { MutableRefObject } from 'react';
import { useCallback, useEffect, useRef } from 'react';

import { useDoubleRaf } from '@/hooks/useDoubleRaf';

import type { ModalState } from './useImageZoom';

interface UseImageZoomAnimationOptions {
  modalState: ModalState;
  refreshModalImgStyle: (isZoomed: boolean) => void;
}

interface UseImageZoomAnimationReturn {
  zoomInitRef: MutableRefObject<boolean>;
  shouldZoomImageRef: MutableRefObject<boolean>;
}

/**
 * modalState に応じて 2 段階 rAF でズーム用スタイルを更新します。
 */
export function useImageZoomAnimation({
  modalState,
  refreshModalImgStyle,
}: UseImageZoomAnimationOptions): UseImageZoomAnimationReturn {
  const zoomInitRef = useRef(false);
  const shouldZoomImageRef = useRef(false);
  const { schedule: scheduleDoubleRaf, cancel: cancelDoubleRaf } = useDoubleRaf();

  const handleLoading = useCallback(() => {
    if (zoomInitRef.current) return;
    zoomInitRef.current = true;
    shouldZoomImageRef.current = false;

    scheduleDoubleRaf(
      () => refreshModalImgStyle(false),
      () => {
        shouldZoomImageRef.current = true;
        refreshModalImgStyle(true);
      },
    );
  }, [scheduleDoubleRaf, refreshModalImgStyle]);

  const handleUnloading = useCallback(() => {
    cancelDoubleRaf();
    shouldZoomImageRef.current = false;
    refreshModalImgStyle(false);
  }, [cancelDoubleRaf, refreshModalImgStyle]);

  const handleUnloaded = useCallback(() => {
    cancelDoubleRaf();
    shouldZoomImageRef.current = false;
    refreshModalImgStyle(false);
    zoomInitRef.current = false;
  }, [cancelDoubleRaf, refreshModalImgStyle]);

  useEffect(() => {
    switch (modalState) {
      case 'LOADING':
        handleLoading();
        break;

      case 'UNLOADING':
        handleUnloading();
        break;

      case 'UNLOADED':
        handleUnloaded();
        break;
    }
  }, [modalState, handleLoading, handleUnloading, handleUnloaded]);

  return { zoomInitRef, shouldZoomImageRef };
}
