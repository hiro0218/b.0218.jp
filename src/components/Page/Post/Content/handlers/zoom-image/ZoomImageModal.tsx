'use client';

import dynamic from 'next/dynamic';
import type { CSSProperties, FC, ImgHTMLAttributes } from 'react';
import { memo, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useImageZoom } from '@/hooks/useImageZoom';
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

interface ZoomImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
}

const ZoomImage: FC<ZoomImageProps> = ({ alt, src, style, ...props }) => {
  const processedStyle = useMemo(
    () => (style && typeof style === 'string' ? parseStyleStringToObject(style) : style),
    [style],
  );

  const hasObjectFit = useMemo(() => {
    if (!processedStyle) return false;
    // CSSProperties またはRecord<string, string>として型安全にチェック
    const styleObj = processedStyle as CSSProperties | Record<string, string>;
    return 'objectFit' in styleObj && styleObj.objectFit !== undefined;
  }, [processedStyle]);

  const { imgRef, isZoomed, zoomIn, zoomOut, handleImageLoad, keyboardProps } = useImageZoom({
    hasObjectFit,
    minImageSize: MIN_IMAGE_SIZE,
  });

  return (
    <>
      <span className={containerStyle} onClick={isZoomed ? undefined : zoomIn}>
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
              onClick={zoomOut}
              src={src}
              {...keyboardProps}
            />
            <Overlay onClick={zoomOut} />
          </>,
          document.body,
        )}
    </>
  );
};

export default memo(ZoomImage);
