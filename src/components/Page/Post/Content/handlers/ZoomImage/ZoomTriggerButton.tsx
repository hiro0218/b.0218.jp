'use client';

import { ZoomInIcon } from '@radix-ui/react-icons';
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

  &:hover {
    & > * {
      opacity: 1;
    }
  }

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

const zoomIndicatorStyle = css`
  position: absolute;
  top: var(--spacing-1);
  right: var(--spacing-1);
  display: grid;
  place-items: center;
  width: var(--sizes-icon-md);
  height: var(--sizes-icon-md);
  pointer-events: none;
  background: var(--colors-gray-a-100);
  border-radius: var(--radii-full);
  opacity: 0;
  transition: opacity 0.2s;

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

const zoomIconStyle = css`
  display: block;
  width: 16px;
  height: 16px;
  color: var(--colors-text-primary);
`;

interface ZoomTriggerButtonProps {
  /** ボタンの aria-label */
  a11yLabel: string;
  /** 現在のモーダル状態 */
  modalState: ModalState;
  /** ズーム中かどうか */
  isZoomed: boolean;
  /** ズームイン処理を実行する関数 */
  zoomIn: () => void;
  /** 画像の alt テキスト */
  alt?: string;
  /** 画像の src */
  src: string;
  /** 画像に適用するスタイル */
  style?: CSSProperties;
  /** 画像要素に渡す追加の props */
  imgProps: Omit<ImgHTMLAttributes<HTMLImageElement>, 'alt' | 'src' | 'style' | 'onLoad' | 'ref'>;
  /** 画像ロード完了時のハンドラ */
  onImageLoad: () => void;
  /** 画像要素への ref */
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
      <span aria-hidden="true" className={cx(zoomIndicatorStyle, 'zoom-indicator')}>
        <ZoomInIcon className={zoomIconStyle} />
      </span>
    </button>
  );
}

export const ZoomTriggerButton = memo(ZoomTriggerButtonComponent);
