'use client';

import { ZoomInIcon } from '@radix-ui/react-icons';
import type { CSSProperties, ImgHTMLAttributes, ReactNode, RefObject } from 'react';
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
  width: var(--spacing-2);
  height: var(--spacing-2);
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

/** 画像をクリックしてズームモーダルを開くためのボタン */
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
  return (
    <button
      aria-disabled={isOpen || undefined}
      aria-expanded={isOpen}
      aria-label={a11yLabel}
      className={cx(buttonStyle, isOpen ? buttonHiddenClass : buttonVisibleClass)}
      onClick={isOpen ? undefined : zoomIn}
      type="button"
    >
      <img alt={alt} src={src} style={style} {...imgProps} onLoad={onImageLoad} ref={imgRef} />
      <span aria-hidden="true" className={cx(zoomIndicatorStyle, 'zoom-indicator')}>
        <ZoomInIcon className={zoomIconStyle} />
      </span>
    </button>
  );
}
