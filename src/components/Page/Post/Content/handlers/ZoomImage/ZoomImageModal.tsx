'use client';

import type { CSSProperties, FC, ImgHTMLAttributes } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { parseStyleStringToObject } from '@/lib/browser/parseStyleStringToObject';
import type { ZoomImageSource } from '../types';
import { useImageZoom } from './hooks/useImageZoom';
import { useImageZoomAnimation } from './hooks/useImageZoomAnimation';
import { useImageZoomDialog } from './hooks/useImageZoomDialog';
import { useImageZoomTransition } from './hooks/useImageZoomTransition';
import { ZoomDialog } from './ZoomDialog';
import { ZoomTriggerButton } from './ZoomTriggerButton';

const MIN_IMAGE_SIZE = 100;

interface A11yOptions {
  /**
   * ズームトリガーボタンの aria-label
   * @default '画像をズーム'
   */
  a11yNameButtonZoom?: string;

  /**
   * ズームダイアログの aria-label
   * @default '画像のズーム表示'
   */
  a11yNameDialog?: string;
}

type ZoomImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  src: string;
  zoomImg?: ZoomImageSource;
  a11yOptions?: A11yOptions;
};

/**
 * デフォルトのアクセシビリティラベル
 */
const DEFAULT_A11Y: Required<A11yOptions> = {
  a11yNameButtonZoom: '画像をズーム',
  a11yNameDialog: '画像のズーム表示',
};

function ensureNumber(value: unknown): number {
  return typeof value === 'number' ? value : 0;
}

function getScaleToWindow(params: { height: number; width: number; offset: number }): number {
  return Math.min(
    (window.innerWidth - params.offset * 2) / params.width,
    (window.innerHeight - params.offset * 2) / params.height,
  );
}

function getScaleToWindowMax(params: {
  containerHeight: number;
  containerWidth: number;
  offset: number;
  targetHeight: number;
  targetWidth: number;
}): number {
  const scale = getScaleToWindow({
    height: params.targetHeight,
    offset: params.offset,
    width: params.targetWidth,
  });
  const ratio =
    params.targetWidth > params.targetHeight
      ? params.targetWidth / params.containerWidth
      : params.targetHeight / params.containerHeight;
  return scale > 1 ? ratio : scale * ratio;
}

function getScale(params: {
  containerHeight: number;
  containerWidth: number;
  hasScalableSrc: boolean;
  offset: number;
  targetHeight: number;
  targetWidth: number;
}): number {
  if (!params.containerHeight || !params.containerWidth) {
    return 1;
  }

  const hasValidTarget = params.targetHeight > 0 && params.targetWidth > 0;
  const shouldUseNaturalSize = !params.hasScalableSrc && hasValidTarget;

  if (shouldUseNaturalSize) {
    return getScaleToWindowMax(params);
  }

  return getScaleToWindow({
    height: params.containerHeight,
    offset: params.offset,
    width: params.containerWidth,
  });
}

function getModalImgStyle(params: {
  hasScalableSrc: boolean;
  isZoomed: boolean;
  offset: number;
  targetEl: HTMLImageElement;
}): CSSProperties {
  const imgRect = params.targetEl.getBoundingClientRect();
  const targetWidth = params.targetEl.naturalWidth || imgRect.width;
  const targetHeight = params.targetEl.naturalHeight || imgRect.height;
  const scale = getScale({
    containerHeight: imgRect.height,
    containerWidth: imgRect.width,
    hasScalableSrc: params.hasScalableSrc,
    offset: params.offset,
    targetHeight,
    targetWidth,
  });

  const style: CSSProperties = {
    top: imgRect.top,
    left: imgRect.left,
    width: imgRect.width * scale,
    height: imgRect.height * scale,
    transform: `translate(0,0) scale(${1 / scale})`,
  };

  if (params.isZoomed) {
    const width = ensureNumber(style.width);
    const height = ensureNumber(style.height);
    const left = ensureNumber(style.left);
    const top = ensureNumber(style.top);
    const translateX = window.innerWidth / 2 - (left + width / 2);
    const translateY = window.innerHeight / 2 - (top + height / 2);
    style.transform = `translate(${translateX}px,${translateY}px) scale(1)`;
  }

  return style;
}

const ZoomImage: FC<ZoomImageProps> = ({ alt, src, style, zoomImg, a11yOptions, ...props }) => {
  const processedStyle = style && typeof style === 'string' ? parseStyleStringToObject(style) : style;
  const hasObjectFit = !!(processedStyle && 'objectFit' in processedStyle && processedStyle.objectFit);

  const a11y = {
    buttonZoom: a11yOptions?.a11yNameButtonZoom || alt || DEFAULT_A11Y.a11yNameButtonZoom,
    dialog: a11yOptions?.a11yNameDialog || alt || DEFAULT_A11Y.a11yNameDialog,
  };

  const dialogRef = useRef<HTMLDialogElement>(null);
  const modalImgRef = useRef<HTMLImageElement>(null);
  const [modalImgStyle, setModalImgStyle] = useState<CSSProperties>({});
  const [isMounted, setIsMounted] = useState(false);

  const { imgRef, isZoomed, canZoom, modalState, zoomIn, zoomOut, handleImageLoad, handleModalImgTransitionEnd } =
    useImageZoom({
      hasObjectFit,
      minImageSize: MIN_IMAGE_SIZE,
    });

  const isModalActive = modalState === 'LOADING' || modalState === 'LOADED';

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const refreshModalImgStyle = useCallback(
    (isZoomed: boolean) => {
      const targetEl = imgRef.current;
      if (!targetEl) return;
      if (!targetEl.complete || !targetEl.naturalWidth) return;

      setModalImgStyle(
        getModalImgStyle({
          hasScalableSrc: Boolean(zoomImg?.src),
          isZoomed,
          offset: 0,
          targetEl,
        }),
      );
    },
    [imgRef, zoomImg?.src],
  );

  const { shouldZoomImageRef } = useImageZoomAnimation({
    modalState,
    refreshModalImgStyle,
  });

  useImageZoomDialog({
    dialogRef,
    isMounted,
    modalState,
  });

  useImageZoomTransition({
    modalImgRef,
    modalState,
    onTransitionEnd: handleModalImgTransitionEnd,
  });

  useEffect(() => {
    if (!isModalActive) return;

    function handleResize(): void {
      refreshModalImgStyle(shouldZoomImageRef.current);
    }

    window.addEventListener('resize', handleResize, { passive: true });
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isModalActive, refreshModalImgStyle, shouldZoomImageRef]);

  function handleDialogCancel(event: React.SyntheticEvent<HTMLDialogElement>): void {
    event.preventDefault();
    zoomOut();
  }

  function handleDialogContentClick(event: React.MouseEvent<HTMLDivElement>): void {
    if (event.target === event.currentTarget) {
      zoomOut();
    }
  }

  function handleZoomedImageKeyDown(event: React.KeyboardEvent): void {
    const isCloseKey = event.key === 'Escape' || event.key === 'Enter' || event.key === ' ';
    if (isCloseKey) {
      event.preventDefault();
      zoomOut();
    }
  }

  function handleTransitionEnd(event: React.TransitionEvent<HTMLImageElement>): void {
    if (event.propertyName !== 'transform') return;
    handleModalImgTransitionEnd();
  }

  if (!canZoom) {
    return <img alt={alt || ''} src={src} style={processedStyle} {...props} onLoad={handleImageLoad} ref={imgRef} />;
  }

  return (
    <>
      <ZoomTriggerButton
        a11yLabel={a11y.buttonZoom}
        alt={alt}
        imgProps={props}
        imgRef={imgRef}
        isZoomed={isZoomed}
        modalState={modalState}
        onImageLoad={handleImageLoad}
        src={src}
        style={processedStyle}
        zoomIn={zoomIn}
      />

      {isMounted && (
        <ZoomDialog
          a11yLabel={a11y.dialog}
          alt={alt}
          dialogRef={dialogRef}
          isModalActive={isModalActive}
          modalImgRef={modalImgRef}
          modalImgStyle={modalImgStyle}
          onCancel={handleDialogCancel}
          onClose={zoomOut}
          onContentClick={handleDialogContentClick}
          onImageClick={zoomOut}
          onImageKeyDown={handleZoomedImageKeyDown}
          onTransitionEnd={handleTransitionEnd}
          src={src}
          zoomImg={zoomImg}
        />
      )}
    </>
  );
};

export default ZoomImage;
