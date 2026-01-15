import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

/**
 * ズームモーダルの状態を表す型
 *
 * @remarks
 * この状態はモーダルのライフサイクルとアニメーション制御に使用されます。
 *
 * - `UNLOADED`: モーダルが非表示の状態
 * - `LOADING`: モーダルが開き始めている状態（アニメーション開始）
 * - `LOADED`: モーダルが完全に開いた状態（アニメーション完了）
 * - `UNLOADING`: モーダルが閉じ始めている状態（アニメーション開始）
 */
type ModalState = 'UNLOADED' | 'LOADING' | 'LOADED' | 'UNLOADING';

interface UseImageZoomOptions {
  hasObjectFit?: boolean;
  minImageSize?: number;
}

interface UseImageZoomReturn {
  imgRef: React.RefObject<HTMLImageElement>;
  isZoomed: boolean;
  imageLoaded: boolean;
  canZoom: boolean;
  modalState: ModalState;
  zoomIn: () => void;
  zoomOut: () => void;
  handleImageLoad: () => void;
  handleModalImgTransitionEnd: () => void;
}

export const useImageZoom = (options: UseImageZoomOptions = {}): UseImageZoomReturn => {
  const { hasObjectFit = false, minImageSize = 100 } = options;

  const [isZoomed, setIsZoomed] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [canZoom, setCanZoom] = useState(false);
  const [modalState, setModalState] = useState<ModalState>('UNLOADED');
  const imgRef = useRef<HTMLImageElement>(null);

  const zoomIn = useCallback(() => {
    if (!canZoom || !imgRef.current) return;

    setIsZoomed(true);
  }, [canZoom]);

  const zoomOut = useCallback(() => {
    setIsZoomed(false);
  }, []);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  // ズーム可否判定（ResizeObserver による効率的な監視）
  useEffect(() => {
    // objectFit が設定されている場合はズーム不可
    if (hasObjectFit) {
      setCanZoom(false);
      return;
    }

    // 画像が読み込まれていない場合はズーム不可
    if (!imageLoaded || !imgRef.current) {
      setCanZoom(false);
      return;
    }

    const img = imgRef.current;

    /**
     * 画像の自然なサイズからズーム可否を判定
     */
    const updateZoomEligibility = () => {
      const { naturalWidth, naturalHeight } = img;
      setCanZoom(naturalWidth >= minImageSize || naturalHeight >= minImageSize);
    };

    // 初回判定
    updateZoomEligibility();

    // ResizeObserver で画像サイズの変更を監視
    const observer = new ResizeObserver(() => {
      updateZoomEligibility();
    });

    observer.observe(img);

    return () => {
      observer.disconnect();
    };
  }, [hasObjectFit, imageLoaded, minImageSize]);

  // モーダル状態遷移（最終確定は onTransitionEnd で行う）
  useEffect(() => {
    if (isZoomed && modalState !== 'LOADED') {
      setModalState('LOADING');
    } else if (!isZoomed && modalState !== 'UNLOADED') {
      setModalState('UNLOADING');
    }
  }, [isZoomed, modalState]);

  const handleModalImgTransitionEnd = useCallback(() => {
    switch (modalState) {
      case 'LOADING':
        setModalState('LOADED');
        break;
      case 'UNLOADING':
        setModalState('UNLOADED');
        break;
    }
  }, [modalState]);

  // キャッシュ済み画像のロード状態チェック
  useLayoutEffect(() => {
    const img = imgRef.current;
    if (img && !imageLoaded && img.complete && img.naturalWidth) {
      setImageLoaded(true);
    }
  }, [imageLoaded]);

  return {
    imgRef,
    isZoomed,
    imageLoaded,
    canZoom,
    modalState,
    zoomIn,
    zoomOut,
    handleImageLoad,
    handleModalImgTransitionEnd,
  };
};
