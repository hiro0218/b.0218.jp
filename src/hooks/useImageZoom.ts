import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useKeyboard } from 'react-aria';

interface UseImageZoomOptions {
  hasObjectFit?: boolean;
  minImageSize?: number;
}

interface UseImageZoomReturn {
  imgRef: React.RefObject<HTMLImageElement>;
  isZoomed: boolean;
  imageLoaded: boolean;
  zoomIn: () => void;
  zoomOut: () => void;
  handleImageLoad: () => void;
  keyboardProps: ReturnType<typeof useKeyboard>['keyboardProps'];
}

export const useImageZoom = (options: UseImageZoomOptions = {}): UseImageZoomReturn => {
  const { hasObjectFit = false, minImageSize = 100 } = options;

  const [isZoomed, setIsZoomed] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const zoomIn = useCallback(() => {
    if (hasObjectFit) return;
    if (!imageLoaded || !imgRef.current) return;

    const { naturalWidth, naturalHeight } = imgRef.current;
    if (naturalWidth < minImageSize && naturalHeight < minImageSize) return;

    setIsZoomed(true);
  }, [hasObjectFit, imageLoaded, minImageSize]);

  const zoomOut = useCallback(() => setIsZoomed(false), []);

  const handleImageLoad = useCallback(() => setImageLoaded(true), []);

  // React Ariaのキーボードフックを使用
  const { keyboardProps } = useKeyboard({
    onKeyDown: useCallback(
      (e) => {
        if (!isZoomed) return;

        if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          e.stopPropagation();
          zoomOut();
        }
      },
      [isZoomed, zoomOut],
    ),
  });

  // グローバルキーボードイベントの処理
  useEffect(() => {
    if (!isZoomed) return;

    const handleGlobalKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' || event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        event.stopPropagation();
        zoomOut();
      }
    };

    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => {
      document.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, [isZoomed, zoomOut]);

  // スクロールイベントの処理
  useEffect(() => {
    if (!isZoomed) return;

    const handleScroll = () => {
      setIsZoomed(false);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isZoomed]);

  // キャッシュ済み画像のロード状態チェック
  useLayoutEffect(() => {
    const img = imgRef.current;
    if (img && !imageLoaded && img.complete && img.naturalWidth) {
      setImageLoaded(true);
    }
  });

  return {
    imgRef,
    isZoomed,
    imageLoaded,
    zoomIn,
    zoomOut,
    handleImageLoad,
    keyboardProps,
  };
};
