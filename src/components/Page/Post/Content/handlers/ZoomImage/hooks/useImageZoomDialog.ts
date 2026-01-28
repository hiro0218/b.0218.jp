'use client';

import type { RefObject } from 'react';
import { useEffect } from 'react';

import type { ModalState } from './useImageZoom';

interface UseImageZoomDialogOptions {
  /** ダイアログ要素への ref */
  dialogRef: RefObject<HTMLDialogElement | null>;
  /** コンポーネントがマウント済みかどうか */
  isMounted: boolean;
  /** 現在のモーダル状態 */
  modalState: ModalState;
}

/**
 * モーダル状態に応じて dialog 要素の表示/非表示を制御
 *
 * LOADING/LOADED/UNLOADING 状態では dialog を開き、
 * UNLOADED 状態になったら閉じる（アニメーション完了を待つ）。
 *
 * @param options - ダイアログ制御に必要なオプション
 */
export function useImageZoomDialog({ dialogRef, isMounted, modalState }: UseImageZoomDialogOptions): void {
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!isMounted || !dialog) return;

    // LOADING, LOADED, UNLOADING 状態で dialog を開く
    // UNLOADED 状態になってから閉じる（アニメーション完了を待つ）
    const shouldOpen = modalState !== 'UNLOADED';

    if (shouldOpen && !dialog.open) {
      dialog.showModal();
    } else if (!shouldOpen && dialog.open) {
      dialog.close();
    }
  }, [dialogRef, isMounted, modalState]);
}
