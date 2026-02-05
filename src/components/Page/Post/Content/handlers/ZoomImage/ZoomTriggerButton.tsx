'use client';

import { ZoomInIcon } from '@radix-ui/react-icons';
import { useButton } from '@react-aria/button';
import { useFocusRing } from '@react-aria/focus';
import { mergeProps } from '@react-aria/utils';
import type { CSSProperties, ImgHTMLAttributes, ReactNode, RefObject } from 'react';
import { useRef } from 'react';
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

  &[data-focus-visible='true'] {
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
 * React Ariaを使用してキーボード操作とフォーカス管理を標準化しています。
 */
export function ZoomTriggerButton({
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
  const buttonRef = useRef<HTMLButtonElement>(null);

  const { buttonProps } = useButton(
    {
      'aria-label': a11yLabel,
      onPress: isZoomed ? undefined : zoomIn,
      isDisabled: isZoomed,
    },
    buttonRef,
  );

  const { isFocusVisible, focusProps } = useFocusRing();

  return (
    <button
      {...mergeProps(buttonProps, focusProps)}
      className={cx(buttonStyle, modalState === 'UNLOADED' ? buttonVisibleClass : buttonHiddenClass)}
      data-focus-visible={isFocusVisible}
      ref={buttonRef}
      type="button"
    >
      <img alt={alt} src={src} style={style} {...imgProps} onLoad={onImageLoad} ref={imgRef} />
      <span aria-hidden="true" className={cx(zoomIndicatorStyle, 'zoom-indicator')}>
        <ZoomInIcon className={zoomIconStyle} />
      </span>
    </button>
  );
}
