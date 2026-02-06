'use client';

import { ZoomInIcon } from '@radix-ui/react-icons';
import { useButton } from '@react-aria/button';
import { useFocusRing } from '@react-aria/focus';
import { mergeProps } from '@react-aria/utils';
import type { CSSProperties, ImgHTMLAttributes, ReactNode, RefObject } from 'react';
import { useRef } from 'react';
import { css, cx } from '@/ui/styled';

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
  a11yLabel: string;
  isOpen: boolean;
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
 * 画像をクリックしてズームモーダルを開くためのボタン。
 * React Aria でキーボード操作とフォーカス管理を標準化。
 */
export function ZoomTriggerButton({
  a11yLabel,
  isOpen,
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
      onPress: isOpen ? undefined : zoomIn,
      isDisabled: isOpen,
    },
    buttonRef,
  );

  const { isFocusVisible, focusProps } = useFocusRing();

  return (
    <button
      {...mergeProps(buttonProps, focusProps)}
      aria-expanded={isOpen}
      className={cx(buttonStyle, isOpen ? buttonHiddenClass : buttonVisibleClass)}
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
