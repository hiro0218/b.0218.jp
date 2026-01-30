import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

/**
 * ズームモーダルの状態
 *
 * - UNLOADED: モーダル非表示
 * - LOADING: モーダル表示開始（アニメーション中）
 * - LOADED: モーダル表示完了
 * - UNLOADING: モーダル非表示開始（アニメーション中）
 */
export type ModalState = 'UNLOADED' | 'LOADING' | 'LOADED' | 'UNLOADING';

interface UseImageZoomOptions {
  /** object-fit が設定されているか */
  hasObjectFit?: boolean;
  /** ズーム可能な最小画像サイズ（px） */
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

/**
 * 画像ズーム機能を提供
 *
 * @param options - ズーム設定オプション
 * @returns ズーム制御に必要な状態と関数
 */
export function useImageZoom(options: UseImageZoomOptions = {}): UseImageZoomReturn {
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

  // ズーム可能かどうかを判定
  useEffect(() => {
    if (hasObjectFit) {
      setCanZoom(false);
      return;
    }

    if (!imageLoaded || !imgRef.current) {
      setCanZoom(false);
      return;
    }

    const img = imgRef.current;

    function checkImageSizeForZoom(): void {
      const { naturalWidth, naturalHeight } = img;
      setCanZoom(naturalWidth >= minImageSize || naturalHeight >= minImageSize);
    }

    checkImageSizeForZoom();

    const observer = new ResizeObserver(checkImageSizeForZoom);
    observer.observe(img);

    return () => {
      observer.disconnect();
    };
  }, [hasObjectFit, imageLoaded, minImageSize]);

  // isZoomed の変化に応じて modalState を更新
  useEffect(() => {
    if (isZoomed && modalState !== 'LOADED') {
      setModalState('LOADING');
    } else if (!isZoomed && modalState !== 'UNLOADED') {
      setModalState('UNLOADING');
    }
  }, [isZoomed, modalState]);

  // CSS トランジション完了時の状態遷移
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

  // 既にロード済みの画像を検出
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
}
