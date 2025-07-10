'use client';

import dynamic from 'next/dynamic';
import type { ImgHTMLAttributes } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { parseStyleStringToObject } from '@/lib/parseStyleStringToObject';
import { css } from '@/ui/styled/static';

const Overlay = dynamic(() => import('@/components/UI/Overlay').then((module) => module.Overlay));

const containerStyle = css`
  position: relative;
  cursor: zoom-in;
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
  opacity: 1;
  transform: translate(-50%, -50%);
  transition: opacity 0.2s ease;
  will-change: transform, opacity;
`;

type ZoomImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  src: string;
};

const ZoomImage: React.FC<ZoomImageProps> = ({ src, alt, style, ...props }) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  // 文字列形式のstyleをオブジェクトに変換
  const processedStyle = typeof style === 'string' ? parseStyleStringToObject(style) : style;

  const handleZoomIn = useCallback(() => {
    if (imgRef.current && imageLoaded) {
      setIsZoomed(true);
    }
  }, [imageLoaded]);

  const handleZoomOut = useCallback(() => {
    setIsZoomed(false);
  }, []);

  /**
   * ズーム表示中のイベント処理を設定
   * - Escape、Enter、Spaceキーでズーム表示を閉じる
   * - スクロール時にズーム表示を閉じる
   */
  useEffect(() => {
    if (!isZoomed) return;

    // キーボード操作で閉じる
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' || event.key === 'Enter' || event.key === ' ') {
        setIsZoomed(false);
      }
    };

    // スクロール時に閉じる
    const handleScroll = () => {
      setIsZoomed(false);
    };

    // イベントリスナーを登録
    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('scroll', handleScroll, { passive: true });

    // クリーンアップ関数
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isZoomed]);

  /**
   * 画像の読み込み完了時のハンドラ
   * 画像参照が設定されたら読み込み状態を更新する
   */
  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  /**
   * 画像参照が設定された時に既に読み込まれているか確認
   */
  useEffect(() => {
    const img = imgRef.current;
    if (img && !imageLoaded) {
      // naturalWidth/naturalHeightが存在する場合は既に読み込み完了している
      if (img.complete && img.naturalWidth) {
        setImageLoaded(true);
      }
    }
  }, [imageLoaded]);

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
            />
            <Overlay onClick={handleZoomOut} />
          </>,
          document.body,
        )}
    </>
  );
};

export default ZoomImage;
