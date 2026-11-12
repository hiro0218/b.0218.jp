'use client';

import { MagnifyingGlassPlusIcon } from '@phosphor-icons/react/ssr';
import type { ReactNode } from 'react';
import { css, cx } from '@/ui/styled';

const buttonStyle = css`
  position: absolute;
  inset: 0;
  display: block;
  width: 100%;
  height: 100%;
  padding: 0;
  cursor: zoom-in;
  background-color: transparent;
  border: none;

  &:hover {
    & > * {
      opacity: 1;
    }
  }

  &:focus-visible {
    outline: var(--border-widths-medium) solid var(--colors-focus-ring);
    outline-offset: 2px;
  }
`;

const buttonVisibleClass = css`
  visibility: visible;
`;

const buttonHiddenClass = css`
  visibility: hidden;
`;

const zoomIndicatorStyle = css`
  position: absolute;
  top: var(--spacing-100);
  right: var(--spacing-100);
  display: grid;
  place-items: center;
  width: var(--sizes-icon-md);
  height: var(--sizes-icon-md);
  pointer-events: none;
  background-color: var(--colors-gray-a-100);
  border-radius: var(--radii-full);
  opacity: 0;
  transition: opacity var(--transition-slow);

  @media (prefers-reduced-motion: reduce) {
    transition: opacity 0.01s;
  }
`;

const zoomIconStyle = css`
  display: block;
  width: var(--spacing-300);
  height: var(--spacing-300);
  color: var(--colors-gray-1000);
`;

interface TriggerButtonProps {
  label: string;
  isOpen: boolean;
  zoomIn: () => void;
  /** ポインタが乗った(タッチの開始を含む)・フォーカスされたときに呼ぶ。ズームダイアログの先読みの合図 */
  onPrefetch?: () => void;
}

/** 画像をクリックしてズームモーダルを開くためのボタン */
export function TriggerButton({ label, isOpen, zoomIn, onPrefetch }: TriggerButtonProps): ReactNode {
  // 開いている間だけ aria-disabled を付けず、onClick も外さない。visibility: hidden で隠れたボタンでは効く場面がない（二重の open は useImageZoom が止める）
  return (
    <button
      aria-expanded={isOpen}
      aria-label={label}
      className={cx(buttonStyle, isOpen ? buttonHiddenClass : buttonVisibleClass)}
      onClick={zoomIn}
      onFocus={onPrefetch}
      onPointerEnter={onPrefetch}
      type="button"
    >
      <span aria-hidden="true" className={zoomIndicatorStyle}>
        <MagnifyingGlassPlusIcon className={zoomIconStyle} />
      </span>
    </button>
  );
}
