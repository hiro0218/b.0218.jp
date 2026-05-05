'use client';

import type { CSSProperties, ImgHTMLAttributes, JSX } from 'react';
import { useCallback } from 'react';
import useIsMounted from '@/hooks/useIsMounted';
import { parseStyleStringToObject } from '@/lib/browser/parseStyleStringToObject';
import { Dialog } from './ZoomImage/Dialog';
import { useImageZoom } from './ZoomImage/hooks/useImageZoom';
import { TriggerButton } from './ZoomImage/TriggerButton';
import type { ZoomImageSource } from './ZoomImage/types';

const MIN_IMAGE_SIZE = 100;

interface A11yOptions {
  /**
   * ズームトリガーボタンの aria-label
   * @default '画像をズーム'
   */
  buttonZoomLabel?: string;

  /**
   * ズームダイアログの aria-label
   * @default '画像のズーム表示'
   */
  dialogLabel?: string;

  /**
   * ズームダイアログの閉じるボタンの aria-label
   * @default '閉じる'
   */
  closeLabel?: string;
}

type ZoomImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'style'> & {
  src: string;
  style?: CSSProperties | string;
  /** ズーム時に表示する別画像のソース */
  zoomImg?: ZoomImageSource;
  a11yOptions?: A11yOptions;
};

const DEFAULT_A11Y: Required<A11yOptions> = {
  buttonZoomLabel: '画像をズーム',
  dialogLabel: '画像のズーム表示',
  closeLabel: '閉じる',
};

/**
 * ズーム可能な画像コンポーネント。
 * クリックで画像をモーダル表示し、View Transitions API で
 * トリガー画像の位置から画面中央へスムーズに遷移する。
 * @summary クリックでモーダルズームする画像
 */
export function ZoomImage({ alt, src, style, zoomImg, a11yOptions, ...props }: ZoomImageProps): JSX.Element {
  const processedStyle: CSSProperties | undefined = (() => {
    if (!style) {
      return undefined;
    }
    if (typeof style === 'string') {
      return parseStyleStringToObject(style);
    }
    return style;
  })();
  const hasObjectFit = !!(processedStyle && 'objectFit' in processedStyle && processedStyle.objectFit);

  const a11y = {
    buttonZoom: a11yOptions?.buttonZoomLabel || alt || DEFAULT_A11Y.buttonZoomLabel,
    dialog: a11yOptions?.dialogLabel || alt || DEFAULT_A11Y.dialogLabel,
    close: a11yOptions?.closeLabel || DEFAULT_A11Y.closeLabel,
  };

  const isMounted = useIsMounted();

  const { imgRef, dialogRef, dialogImgRef, canZoom, isOpen, open, close, handleImageLoad } = useImageZoom({
    hasObjectFit,
    minImageSize: MIN_IMAGE_SIZE,
  });

  const handleDialogCancel = useCallback(
    (event: React.SyntheticEvent<HTMLDialogElement>) => {
      event.preventDefault();
      close();
    },
    [close],
  );

  // ズーム不可の場合は通常の img 要素を返す
  if (!canZoom) {
    // biome-ignore lint/performance/noImgElement: DOM ref と自然サイズ計測をズーム可否判定に使う
    return <img alt={alt} src={src} style={processedStyle} {...props} onLoad={handleImageLoad} ref={imgRef} />;
  }

  return (
    <>
      <TriggerButton
        alt={alt}
        imgProps={props}
        imgRef={imgRef}
        isOpen={isOpen}
        label={a11y.buttonZoom}
        onImageLoad={handleImageLoad}
        src={src}
        style={processedStyle}
        zoomIn={open}
      />

      {isMounted ? (
        <Dialog
          alt={alt}
          closeLabel={a11y.close}
          dialogImgRef={dialogImgRef}
          dialogRef={dialogRef}
          isOpen={isOpen}
          label={a11y.dialog}
          onCancel={handleDialogCancel}
          onClose={close}
          src={src}
          zoomImg={zoomImg}
        />
      ) : null}
    </>
  );
}
