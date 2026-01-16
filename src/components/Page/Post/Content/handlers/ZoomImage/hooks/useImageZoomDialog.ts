'use client';

import type { RefObject } from 'react';
import { useEffect } from 'react';

import type { ModalState } from './useImageZoom';

interface UseImageZoomDialogOptions {
  dialogRef: RefObject<HTMLDialogElement | null>;
  isMounted: boolean;
  modalState: ModalState;
}

/**
 * modalState に応じて dialog の showModal/close を制御します。
 */
export function useImageZoomDialog({ dialogRef, isMounted, modalState }: UseImageZoomDialogOptions): void {
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!isMounted || !dialog) return;

    const shouldOpen = modalState !== 'UNLOADED';

    if (shouldOpen && !dialog.open) {
      dialog.showModal();
    } else if (!shouldOpen && dialog.open) {
      dialog.close();
    }
  }, [dialogRef, isMounted, modalState]);
}
