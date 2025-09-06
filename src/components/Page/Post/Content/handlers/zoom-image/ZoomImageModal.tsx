'use client';

import dynamic from 'next/dynamic';
import type { CSSProperties, FC, ImgHTMLAttributes } from 'react';
import { memo, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useKeyboard } from 'react-aria';
import { createPortal } from 'react-dom';
import { parseStyleStringToObject } from '@/lib/parseStyleStringToObject';
import { css } from '@/ui/styled';

const Overlay = dynamic(() => import('@/components/UI/Overlay').then((module) => module.Overlay));

const MIN_IMAGE_SIZE = 100;

const containerStyle = css`
  position: relative;
  cursor: zoom-in;
`;

const zoomedImageStyle = css`
  position: fixed;
  top: 50%;
  left: 50%;
  z-index: calc(var(--z-index-overlay) + 1);
  max-width: 90%;
  max-height: 90%;
  pointer-events: auto;
  cursor: zoom-out;
  opacity: 1;
  transform: translate(-50%, -50%);
  transition: opacity 0.2s ease;
  will-change: transform, opacity;
`;

type ZoomImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  src: string;
};

const ZoomImage: FC<ZoomImageProps> = ({ alt, src, style, ...props }) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const processedStyle = useMemo(
    () => (style && typeof style === 'string' ? parseStyleStringToObject(style) : style),
    [style],
  );

  const hasObjectFit = useMemo(() => {
    if (!processedStyle) return false;
    // CSSPropertiesまたはRecord<string, string>として型安全にチェック
    const styleObj = processedStyle as CSSProperties | Record<string, string>;
    return 'objectFit' in styleObj && styleObj.objectFit !== undefined;
  }, [processedStyle]);

  const handleZoomIn = useCallback(() => {
    // object-fitは画像の表示領域調整を行うため、ズーム表示が不適切になる
    if (hasObjectFit) return;

    if (!imageLoaded || !imgRef.current) return;

    const { naturalWidth, naturalHeight } = imgRef.current;
    if (naturalWidth < MIN_IMAGE_SIZE && naturalHeight < MIN_IMAGE_SIZE) return;

    setIsZoomed(true);
  }, [hasObjectFit, imageLoaded]);

  const handleZoomOut = useCallback(() => setIsZoomed(false), []);

  // React Ariaのキーボードフックを使用
  const { keyboardProps } = useKeyboard({
    onKeyDown: useCallback(
      (e) => {
        if (!isZoomed) return;

        // ESCキーまたはEnterキーでズームを解除
        if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          e.stopPropagation();
          handleZoomOut();
        }
      },
      [isZoomed, handleZoomOut],
    ),
  });

  // グローバルキーボードイベントの処理
  useEffect(() => {
    if (!isZoomed) return;

    const handleGlobalKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' || event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        event.stopPropagation();
        handleZoomOut();
      }
    };

    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => {
      document.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, [isZoomed, handleZoomOut]);

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

  const handleImageLoad = () => setImageLoaded(true);

  useLayoutEffect(() => {
    const img = imgRef.current;
    if (img && !imageLoaded && img.complete && img.naturalWidth) {
      // キャッシュ済み画像の場合、completeがtrueでnaturalWidthが存在する
      setImageLoaded(true);
    }
  });

  return (
    <>
      <span className={containerStyle} onClick={isZoomed ? undefined : handleZoomIn}>
        <img alt={alt || ''} src={src} style={processedStyle} {...props} onLoad={handleImageLoad} ref={imgRef} />
      </span>

      {isZoomed &&
        createPortal(
          <>
            <img
              alt={alt || ''}
              className={zoomedImageStyle}
              data-is-zoom-image="true"
              loading="lazy"
              onClick={handleZoomOut}
              src={src}
              {...keyboardProps}
            />
            <Overlay onClick={handleZoomOut} />
          </>,
          document.body,
        )}
    </>
  );
};

export default memo(ZoomImage);
