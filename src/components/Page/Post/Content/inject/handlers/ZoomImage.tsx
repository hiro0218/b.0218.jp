import dynamic from 'next/dynamic';
import type { ImgHTMLAttributes } from 'react';
import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { css, styled } from '@/ui/styled/static';

const Overlay = dynamic(() => import('@/components/UI/Overlay').then((module) => module.Overlay));

const containerStyle = css`
  position: relative;
  cursor: zoom-in;
`;

const ZoomedImg = styled.img`
  position: fixed;
  top: 50%;
  left: 50%;
  z-index: calc(var(--zIndex-overlay) + 1);
  max-width: 90%;
  max-height: 90%;
  cursor: zoom-out;
  transform: translate(-50%, -50%) scale(1);
`;

type ZoomImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  src: string;
};

const ZoomImage: React.FC<ZoomImageProps> = ({ src, alt, ...props }) => {
  const [isZoomed, setIsZoomed] = useState(false);

  const handleZoomIn = useCallback(() => setIsZoomed(true), []);
  const handleZoomOut = useCallback(() => setIsZoomed(false), []);

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

  return (
    <>
      <div className={containerStyle} onClick={handleZoomIn}>
        {/** biome-ignore lint/nursery/noImgElement: use raw */}
        <img src={src} alt={alt} {...props} />
      </div>
      {isZoomed &&
        createPortal(
          <>
            <ZoomedImg src={src} alt={alt || ''} loading="lazy" onClick={handleZoomOut} data-is-zoom-image={isZoomed} />
            <Overlay onClick={handleZoomOut} />
          </>,
          document.body,
        )}
    </>
  );
};

export default ZoomImage;
