import dynamic from 'next/dynamic';
import type { ImgHTMLAttributes } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { css } from '@/ui/styled/static';

const Overlay = dynamic(() => import('@/components/UI/Overlay').then((module) => module.Overlay));

const containerStyle = css`
  position: relative;
  cursor: zoom-in;
`;

const normalImageStyle = css`
  display: block;
  max-width: 100%;
  height: auto;
`;

const zoomedImageStyle = css`
  position: fixed;
  top: 50%;
  left: 50%;
  z-index: calc(var(--zIndex-overlay) + 1);
  max-width: 90%;
  max-height: 90%;
  pointer-events: auto;
  cursor: zoom-out;
  transform: translate(-50%, -50%);
`;

type ZoomImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  src: string;
};

const ZoomImage: React.FC<ZoomImageProps> = ({ src, alt, ...props }) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleZoomIn = useCallback(() => {
    if (imgRef.current && imageLoaded) {
      setIsZoomed(true);
    }
  }, [imageLoaded]);

  const handleZoomOut = useCallback(() => {
    setIsZoomed(false);
  }, []);

  // Escapeキーで閉じる
  useEffect(() => {
    if (!isZoomed) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsZoomed(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isZoomed]);

  // スクロール時にズームを解除
  useEffect(() => {
    if (!isZoomed) return;

    const handleScroll = () => {
      setIsZoomed(false);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isZoomed]);

  // 画像の読み込み完了時のハンドラ
  const handleImageLoad = useCallback(() => {
    if (imgRef.current) {
      setImageLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (imgRef.current && !imageLoaded) {
      handleImageLoad();
    }
  }, [imageLoaded, handleImageLoad]);

  return (
    <>
      <span className={containerStyle} onClick={isZoomed ? undefined : handleZoomIn}>
        {/* biome-ignore lint/nursery/noImgElement: use raw */}
        <img src={src} alt={alt || ''} {...props} ref={imgRef} className={normalImageStyle} onLoad={handleImageLoad} />
      </span>

      {/* ズーム時のみPortalで拡大画像とオーバーレイを表示 */}
      {isZoomed &&
        createPortal(
          <>
            {/* biome-ignore lint/nursery/noImgElement: use raw */}
            <img
              src={src}
              alt={alt || ''}
              className={zoomedImageStyle}
              onClick={handleZoomOut}
              loading="lazy"
              data-is-zoom-image="true"
            />
            <Overlay onClick={handleZoomOut} />
          </>,
          document.body,
        )}
    </>
  );
};

export default ZoomImage;
