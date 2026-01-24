'use client';

import type { CSSProperties, ImgHTMLAttributes, ReactNode, RefObject } from 'react';
import { memo } from 'react';
import { css, cx } from '@/ui/styled';
import type { ModalState } from './hooks/useImageZoom';

const buttonStyle = css`
  position: relative;
  display: inline-block;
  padding: 0;
  background: transparent;
  border: none;

  &:focus-visible {
    outline: 2px solid var(--colors-blue-500);
    outline-offset: 2px;
  }
`;

const buttonVisibleClass = css`
  visibility: visible;
  cursor: zoom-in;
`;

const buttonHiddenClass = css`
  visibility: hidden;
  cursor: zoom-in;
`;

interface ZoomTriggerButtonProps {
  a11yLabel: string;
  modalState: ModalState;
  isZoomed: boolean;
  zoomIn: () => void;
  alt?: string;
  src: string;
  style?: CSSProperties;
  imgProps: Omit<ImgHTMLAttributes<HTMLImageElement>, 'alt' | 'src' | 'style' | 'onLoad' | 'ref'>;
  onImageLoad: () => void;
  imgRef: RefObject<HTMLImageElement | null>;
}

/**
 * ズームトリガーボタンコンポーネント
 *
 * 画像をクリックしてズームモーダルを開くためのボタンです。
 * モーダルが開いている間は非表示になります。
 */
function ZoomTriggerButtonComponent({
  a11yLabel,
  modalState,
  isZoomed,
  zoomIn,
  alt,
  src,
  style,
  imgProps,
  onImageLoad,
  imgRef,
}: ZoomTriggerButtonProps): ReactNode {
  function handleKeyDown(event: React.KeyboardEvent): void {
    const isActivationKey = event.key === 'Enter' || event.key === ' ';
    if (isActivationKey && !isZoomed) {
      event.preventDefault();
      zoomIn();
    }
  }

  return (
    <button
      aria-label={a11yLabel}
      className={cx(buttonStyle, modalState === 'UNLOADED' ? buttonVisibleClass : buttonHiddenClass)}
      onClick={isZoomed ? undefined : zoomIn}
      onKeyDown={handleKeyDown}
      type="button"
    >
      <img alt={alt || ''} src={src} style={style} {...imgProps} onLoad={onImageLoad} ref={imgRef} />
    </button>
  );
}

export const ZoomTriggerButton = memo(ZoomTriggerButtonComponent);
