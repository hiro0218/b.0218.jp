'use client';

import { MagnifyingGlassPlusIcon } from '@heroicons/react/24/outline';
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
  top: var(--spacing-1);
  right: var(--spacing-1);
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
  width: var(--spacing-2);
  height: var(--spacing-2);
  color: var(--colors-gray-1000);
`;

interface TriggerButtonProps {
  label: string;
  isOpen: boolean;
  zoomIn: () => void;
}

/** 画像をクリックしてズームモーダルを開くためのボタン */
export function TriggerButton({ label, isOpen, zoomIn }: TriggerButtonProps): ReactNode {
  return (
    <button
      aria-disabled={isOpen || undefined}
      aria-expanded={isOpen}
      aria-label={label}
      className={cx(buttonStyle, isOpen ? buttonHiddenClass : buttonVisibleClass)}
      onClick={isOpen ? undefined : zoomIn}
      type="button"
    >
      <span aria-hidden="true" className={cx(zoomIndicatorStyle, 'zoom-indicator')}>
        <MagnifyingGlassPlusIcon className={zoomIconStyle} />
      </span>
    </button>
  );
}
