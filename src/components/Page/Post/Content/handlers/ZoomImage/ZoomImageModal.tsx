'use client';

import type { CSSProperties, ImgHTMLAttributes, JSX } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import useIsMounted from '@/hooks/useIsMounted';
import { parseStyleStringToObject } from '@/lib/browser/parseStyleStringToObject';
import { css } from '@/ui/styled';
import type { ZoomImageSource } from '../types';
import { useImageZoom } from './hooks/useImageZoom';
import { useImageZoomAnimation } from './hooks/useImageZoomAnimation';
import { useImageZoomDialog } from './hooks/useImageZoomDialog';
import { calculateModalImgStyle } from './utils/calculateZoomStyle';
import { ZoomDialog } from './ZoomDialog';
import { ZoomTriggerButton } from './ZoomTriggerButton';

const MIN_IMAGE_SIZE = 100;

const loadingIndicatorStyle = css`
  position: fixed;
  top: 50%;
  left: 50%;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: var(--colors-overlay-backgrounds);
  border: 1px solid var(--colors-border-default);
  border-radius: var(--radii-md);
  transform: translate(-50%, -50%);
  animation: fadeIn 0.2s;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const spinnerStyle = css`
  width: 24px;
  height: 24px;
  border: 3px solid var(--colors-border-default);
  border-top-color: var(--colors-blue-500);
  border-radius: var(--radii-full);
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    border-top-color: var(--colors-border-default);
    animation: none;
  }
`;

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

const DEFAULT_A11Y: Required<A11yOptions> = {
  a11yNameButtonZoom: '画像をズーム',
  a11yNameDialog: '画像のズーム表示',
};

/**
 * ズーム可能な画像コンポーネント
 *
 * クリックで画像をモーダル表示し、transform ベースのアニメーションで
 * トリガー画像の位置から画面中央へスムーズに遷移する。
 */
function ZoomImage({ alt, src, style, zoomImg, a11yOptions, ...props }: ZoomImageProps): JSX.Element {
  const processedStyle = style && typeof style === 'string' ? parseStyleStringToObject(style) : style;
  const hasObjectFit = !!(processedStyle && 'objectFit' in processedStyle && processedStyle.objectFit);

  const a11y = {
    buttonZoom: a11yOptions?.a11yNameButtonZoom || alt || DEFAULT_A11Y.a11yNameButtonZoom,
    dialog: a11yOptions?.a11yNameDialog || alt || DEFAULT_A11Y.a11yNameDialog,
  };

  const dialogRef = useRef<HTMLDialogElement>(null);
  const modalImgRef = useRef<HTMLImageElement>(null);
  const [modalImgStyle, setModalImgStyle] = useState<CSSProperties>({});
  const isMounted = useIsMounted();
  const [isLoadingZoomImg, setIsLoadingZoomImg] = useState(false);

  const { imgRef, isZoomed, canZoom, modalState, zoomIn, zoomOut, handleImageLoad, handleModalImgTransitionEnd } =
    useImageZoom({
      hasObjectFit,
      minImageSize: MIN_IMAGE_SIZE,
    });

  const isModalActive = modalState === 'LOADING' || modalState === 'LOADED';

  // ズーム画像のプリロード
  useEffect(() => {
    if (!zoomImg?.src || !canZoom) return;

    setIsLoadingZoomImg(true);
    const img = new Image();

    img.onload = () => {
      setIsLoadingZoomImg(false);
    };

    img.onerror = () => {
      setIsLoadingZoomImg(false);
    };

    img.src = zoomImg.src;

    if (zoomImg.srcSet) {
      img.srcset = zoomImg.srcSet;
    }
  }, [zoomImg?.src, zoomImg?.srcSet, canZoom]);

  /**
   * モーダル画像のスタイルを更新
   *
   * @param isZoomed - ズーム状態か否か
   */
  const refreshModalImgStyle = useCallback(
    (isZoomed: boolean) => {
      const targetEl = imgRef.current;
      if (!targetEl) return;
      if (!targetEl.complete || !targetEl.naturalWidth) return;

      setModalImgStyle(
        calculateModalImgStyle({
          hasScalableSrc: Boolean(zoomImg?.src),
          isZoomed,
          offset: 0,
          targetEl,
        }),
      );
    },
    [imgRef, zoomImg?.src],
  );

  /**
   * ズームイン処理
   *
   * 初期位置（トリガー画像の位置）を設定した上でズームを開始する。
   * 実際のアニメーションおよびズーム後スタイルの更新は useImageZoomAnimation に委譲する。
   */
  const handleZoomIn = useCallback(() => {
    // 初期位置（トリガー画像の位置）を設定
    refreshModalImgStyle(false);
    // ズーム状態への遷移をトリガー（後続のアニメーションはフック側で制御）
    zoomIn();
  }, [zoomIn, refreshModalImgStyle]);

  const handleZoomOut = useCallback(() => {
    zoomOut();
  }, [zoomOut]);

  const handleDialogCancel = useCallback(
    (event: React.SyntheticEvent<HTMLDialogElement>) => {
      event.preventDefault();
      handleZoomOut();
    },
    [handleZoomOut],
  );

  const handleDialogContentClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (event.target === event.currentTarget) {
        handleZoomOut();
      }
    },
    [handleZoomOut],
  );

  const handleTransitionEnd = useCallback(
    (event: React.TransitionEvent<HTMLImageElement>) => {
      if (event.propertyName !== 'transform') return;
      handleModalImgTransitionEnd();
    },
    [handleModalImgTransitionEnd],
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

  // リサイズ時にモーダル画像の位置を再計算
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

  // ズーム不可の場合は通常の img 要素を返す
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
        zoomIn={handleZoomIn}
      />

      {isMounted && (
        <>
          <ZoomDialog
            a11yLabel={a11y.dialog}
            alt={alt}
            dialogRef={dialogRef}
            isModalActive={isModalActive}
            modalImgRef={modalImgRef}
            modalImgStyle={modalImgStyle}
            modalState={modalState}
            onCancel={handleDialogCancel}
            onClose={handleZoomOut}
            onContentClick={handleDialogContentClick}
            onImageClick={handleZoomOut}
            onTransitionEnd={handleTransitionEnd}
            src={src}
            zoomImg={zoomImg}
          />
          {isLoadingZoomImg && modalState === 'UNLOADED' && (
            <div className={loadingIndicatorStyle}>
              <div aria-live="polite" className={spinnerStyle} role="status">
                <span className="sr-only">画像を読み込み中</span>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}

export default ZoomImage;
