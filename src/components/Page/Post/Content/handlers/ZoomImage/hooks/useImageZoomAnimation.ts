'use client';

import { useEffect, useRef } from 'react';

import type { ModalState } from './useImageZoom';

interface UseImageZoomAnimationOptions {
  modalState: ModalState;
  refreshModalImgStyle: (isZoomed: boolean) => void;
}

/**
 * モーダル状態に応じてズームアニメーションを制御
 *
 * @param options - モーダル状態とスタイル更新関数
 * @returns アニメーション状態を管理する ref オブジェクト
 */
export function useImageZoomAnimation({ modalState, refreshModalImgStyle }: UseImageZoomAnimationOptions) {
  const isAnimationInitializedRef = useRef(false);
  const shouldZoomImageRef = useRef(false);

  useEffect(() => {
    switch (modalState) {
      case 'LOADING': {
        if (!isAnimationInitializedRef.current) {
          isAnimationInitializedRef.current = true;
          shouldZoomImageRef.current = true;
          refreshModalImgStyle(true);
        }
        break;
      }

      case 'UNLOADING': {
        shouldZoomImageRef.current = false;
        isAnimationInitializedRef.current = false;
        refreshModalImgStyle(false);
        break;
      }

      case 'UNLOADED': {
        // アニメーション完了後のクリーンアップ
        shouldZoomImageRef.current = false;
        isAnimationInitializedRef.current = false;
        break;
      }
    }
  }, [modalState, refreshModalImgStyle]);

  return { shouldZoomImageRef };
}
