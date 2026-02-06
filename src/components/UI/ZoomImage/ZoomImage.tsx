'use client';

import type { CSSProperties, ImgHTMLAttributes, JSX } from 'react';
import { useCallback } from 'react';
import useIsMounted from '@/hooks/useIsMounted';
import { parseStyleStringToObject } from '@/lib/browser/parseStyleStringToObject';
import { useImageZoom } from './hooks/useImageZoom';
import type { ZoomImageSource } from './types';
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

type ZoomImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'style'> & {
  src: string;
  style?: CSSProperties | string;
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
 * クリックで画像をモーダル表示し、View Transitions API で
 * トリガー画像の位置から画面中央へスムーズに遷移する。
 */
function ZoomImage({ alt, src, style, zoomImg, a11yOptions, ...props }: ZoomImageProps): JSX.Element {
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
    buttonZoom: a11yOptions?.a11yNameButtonZoom || alt || DEFAULT_A11Y.a11yNameButtonZoom,
    dialog: a11yOptions?.a11yNameDialog || alt || DEFAULT_A11Y.a11yNameDialog,
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
    return <img alt={alt} src={src} style={processedStyle} {...props} onLoad={handleImageLoad} ref={imgRef} />;
  }

  return (
    <>
      <ZoomTriggerButton
        a11yLabel={a11y.buttonZoom}
        alt={alt}
        imgProps={props}
        imgRef={imgRef}
        isOpen={isOpen}
        onImageLoad={handleImageLoad}
        src={src}
        style={processedStyle}
        zoomIn={open}
      />

      {isMounted && (
        <ZoomDialog
          a11yLabel={a11y.dialog}
          alt={alt}
          dialogImgRef={dialogImgRef}
          dialogRef={dialogRef}
          onCancel={handleDialogCancel}
          onClose={close}
          src={src}
          zoomImg={zoomImg}
        />
      )}
    </>
  );
}

export default ZoomImage;
