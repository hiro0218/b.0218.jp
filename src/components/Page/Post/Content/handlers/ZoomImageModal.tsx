'use client';

import type { CSSProperties, FC, ImgHTMLAttributes } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useImageZoom } from '@/hooks/useImageZoom';
import { parseStyleStringToObject } from '@/lib/browser/parseStyleStringToObject';
import { css } from '@/ui/styled';

const MIN_IMAGE_SIZE = 100;
const TRANSITION_MS = 200;

const buttonStyle = css`
  position: relative;
  display: inline-block;
  padding: 0;
  cursor: zoom-in;
  background: transparent;
  border: none;

  &:disabled {
    cursor: default;
    opacity: 0.6;
  }

  &:focus-visible {
    outline: 2px solid var(--colors-blue-500);
    outline-offset: 2px;
  }
`;

const dialogStyle = css`
  &::backdrop {
    display: none;
  }

  &[open] {
    position: fixed;
    width: 100vw;
    width: 100dvw;
    max-width: none;
    height: 100vh;
    height: 100dvh;
    max-height: none;
    padding: 0;
    margin: 0;
    overflow: hidden;
    pointer-events: all;
    background: transparent;
    border: 0;
  }
`;

const overlayStyle = css`
  position: absolute;
  inset: 0;
  backdrop-filter: blur(4px);
  transition: background-color 0.2s;

  &[data-zoom-modal-overlay='hidden'] {
    background-color: rgba(0, 0, 0, 0);
  }

  &[data-zoom-modal-overlay='visible'] {
    background-color: var(--colors-gray-a-11);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

const modalContentStyle = css`
  position: relative;
  width: 100%;
  height: 100%;
`;

const zoomedImageStyle = css`
  position: absolute;
  cursor: zoom-out;
  image-rendering: high-quality;
  transform-origin: top left;
  transition: transform 0.2s;

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

/**
 * アクセシビリティオプション
 */
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
  zoomImg?: {
    src: string;
    srcSet?: string;
  };
  a11yOptions?: A11yOptions;
};

/**
 * デフォルトのアクセシビリティラベル
 */
const DEFAULT_A11Y: Required<A11yOptions> = {
  a11yNameButtonZoom: '画像をズーム',
  a11yNameDialog: '画像のズーム表示',
};

const getScaleToWindow = (params: { height: number; width: number; offset: number }): number =>
  Math.min(
    (window.innerWidth - params.offset * 2) / params.width,
    (window.innerHeight - params.offset * 2) / params.height,
  );

const getScaleToWindowMax = (params: {
  containerHeight: number;
  containerWidth: number;
  offset: number;
  targetHeight: number;
  targetWidth: number;
}): number => {
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
};

const getScale = (params: {
  containerHeight: number;
  containerWidth: number;
  hasScalableSrc: boolean;
  offset: number;
  targetHeight: number;
  targetWidth: number;
}): number => {
  if (!params.containerHeight || !params.containerWidth) {
    return 1;
  }
  return !params.hasScalableSrc && params.targetHeight && params.targetWidth
    ? getScaleToWindowMax(params)
    : getScaleToWindow({ height: params.containerHeight, offset: params.offset, width: params.containerWidth });
};

/**
 * CSSProperties の数値型プロパティを安全に number に変換
 */
const toNumber = (value: unknown): number => (typeof value === 'number' ? value : 0);

const getModalImgStyle = (params: {
  hasScalableSrc: boolean;
  isZoomed: boolean;
  offset: number;
  targetEl: HTMLImageElement;
}): CSSProperties => {
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
    const width = toNumber(style.width);
    const height = toNumber(style.height);
    const left = toNumber(style.left);
    const top = toNumber(style.top);
    const translateX = window.innerWidth / 2 - (left + width / 2);
    const translateY = window.innerHeight / 2 - (top + height / 2);
    style.transform = `translate(${translateX}px,${translateY}px) scale(1)`;
  }

  return style;
};

const ZoomImage: FC<ZoomImageProps> = ({ alt, src, style, zoomImg, a11yOptions, ...props }) => {
  const processedStyle = style && typeof style === 'string' ? parseStyleStringToObject(style) : style;
  const hasObjectFit = !!(processedStyle && 'objectFit' in processedStyle && processedStyle.objectFit);

  // アクセシビリティラベルのマージ（カスタム値 > alt > デフォルト値）
  const a11y = {
    buttonZoom: a11yOptions?.a11yNameButtonZoom || alt || DEFAULT_A11Y.a11yNameButtonZoom,
    dialog: a11yOptions?.a11yNameDialog || alt || DEFAULT_A11Y.a11yNameDialog,
  };

  const dialogRef = useRef<HTMLDialogElement>(null);
  const modalImgRef = useRef<HTMLImageElement>(null);
  const transitionTimeoutRef = useRef<number | null>(null);
  const zoomInitRef = useRef(false);
  const [modalImgStyle, setModalImgStyle] = useState<CSSProperties>({});
  const { imgRef, isZoomed, canZoom, modalState, zoomIn, zoomOut, handleImageLoad, handleModalImgTransitionEnd } =
    useImageZoom({
      hasObjectFit,
      minImageSize: MIN_IMAGE_SIZE,
    });

  const isModalActive = modalState === 'LOADING' || modalState === 'LOADED';
  const shouldZoomImageRef = useRef(false);
  const overlayState = modalState === 'UNLOADED' || modalState === 'UNLOADING' ? 'hidden' : 'visible';
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // prefers-reduced-motionの動的検知
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
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

  // アニメーションスタイル制御
  useEffect(() => {
    if (modalState === 'LOADING') {
      if (zoomInitRef.current) return;
      zoomInitRef.current = true;
      shouldZoomImageRef.current = false;
      // 2段階の rAF で元の位置 → 拡大位置へアニメーション
      requestAnimationFrame(() => {
        refreshModalImgStyle(false);
        requestAnimationFrame(() => {
          shouldZoomImageRef.current = true;
          refreshModalImgStyle(true);
        });
      });
      return;
    }

    if (modalState === 'UNLOADING' || modalState === 'UNLOADED') {
      shouldZoomImageRef.current = false;
      refreshModalImgStyle(false);
      if (modalState === 'UNLOADED') {
        zoomInitRef.current = false;
      }
    }
  }, [modalState, refreshModalImgStyle]);

  useEffect(() => {
    if (!isModalActive) return;

    const handleResize = () => {
      refreshModalImgStyle(shouldZoomImageRef.current);
    };

    window.addEventListener('resize', handleResize, { passive: true });
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isModalActive, refreshModalImgStyle]);

  const scheduleTransitionFallback = useCallback(() => {
    const imgEl = modalImgRef.current;
    if (!imgEl) return;
    if (transitionTimeoutRef.current) {
      window.clearTimeout(transitionTimeoutRef.current);
    }

    const duration = window.getComputedStyle(imgEl).transitionDuration.split(',')[0]?.trim() || '0s';
    const durationValue = Number.parseFloat(duration);
    const durationMs = Number.isFinite(durationValue)
      ? durationValue * (duration.endsWith('ms') ? 1 : 1000)
      : TRANSITION_MS;

    transitionTimeoutRef.current = window.setTimeout(
      () => {
        handleModalImgTransitionEnd();
      },
      prefersReducedMotion ? 0 : Math.max(durationMs + 50, TRANSITION_MS),
    );
  }, [handleModalImgTransitionEnd, prefersReducedMotion]);

  // onTransitionEnd 不発火時のフォールバックタイマー
  useEffect(() => {
    if (modalState === 'LOADING' || modalState === 'UNLOADING') {
      scheduleTransitionFallback();
      return;
    }

    if (transitionTimeoutRef.current) {
      window.clearTimeout(transitionTimeoutRef.current);
      transitionTimeoutRef.current = null;
    }
  }, [modalState, scheduleTransitionFallback]);

  // dialog 要素の開閉制御
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (modalState !== 'UNLOADED') {
      if (!dialog.open) {
        dialog.showModal();
      }
      return;
    }

    if (dialog.open) {
      dialog.close();
    }
  }, [modalState]);

  // <dialog>のonCloseイベントでzoomOut
  const handleDialogClose = () => {
    zoomOut();
  };

  const handleDialogCancel = (event: React.SyntheticEvent<HTMLDialogElement>) => {
    event.preventDefault();
    zoomOut();
  };

  // 背景クリックで閉じる
  const handleDialogContentClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      zoomOut();
    }
  };

  // キーボードアクセシビリティ：Enter/Spaceでズーム開始
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (!isZoomed && canZoom) {
        zoomIn();
      }
    }
  };

  // キーボードアクセシビリティ：Enter/Space/Escapeでズーム終了
  const handleZoomedKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      zoomOut();
    }
  };

  return (
    <>
      <button
        aria-label={a11y.buttonZoom}
        className={buttonStyle}
        disabled={!canZoom}
        onClick={isZoomed ? undefined : zoomIn}
        onKeyDown={handleKeyDown}
        style={{ visibility: modalState === 'UNLOADED' ? 'visible' : 'hidden' }}
        type="button"
      >
        <img alt={alt || ''} src={src} style={processedStyle} {...props} onLoad={handleImageLoad} ref={imgRef} />
      </button>

      <dialog
        aria-label={a11y.dialog}
        className={dialogStyle}
        onCancel={handleDialogCancel}
        onClose={handleDialogClose}
        ref={dialogRef}
      >
        <div className={overlayStyle} data-zoom-modal-overlay={overlayState} role="presentation" />
        <div className={modalContentStyle} onClick={handleDialogContentClick}>
          <img
            alt={alt || ''}
            className={zoomedImageStyle}
            loading="lazy"
            onClick={zoomOut}
            onKeyDown={handleZoomedKeyDown}
            onTransitionEnd={(event) => {
              if (event.propertyName !== 'transform') return;
              handleModalImgTransitionEnd();
            }}
            ref={modalImgRef}
            src={zoomImg?.src || src}
            srcSet={zoomImg?.srcSet}
            style={modalImgStyle}
            tabIndex={0}
          />
        </div>
      </dialog>
    </>
  );
};

export default ZoomImage;
