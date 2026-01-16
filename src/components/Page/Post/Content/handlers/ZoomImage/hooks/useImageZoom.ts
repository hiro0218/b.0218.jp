import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

/**
 * ズームモーダルの状態
 */
export type ModalState = 'UNLOADED' | 'LOADING' | 'LOADED' | 'UNLOADING';

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

    const checkImageSizeForZoom = () => {
      const { naturalWidth, naturalHeight } = img;
      setCanZoom(naturalWidth >= minImageSize || naturalHeight >= minImageSize);
    };

    checkImageSizeForZoom();

    const observer = new ResizeObserver(() => {
      checkImageSizeForZoom();
    });

    observer.observe(img);

    return () => {
      observer.disconnect();
    };
  }, [hasObjectFit, imageLoaded, minImageSize]);

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
