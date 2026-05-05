'use client';

import { useDialog } from '@react-aria/dialog';
import { FocusScope } from '@react-aria/focus';
import type { ImgHTMLAttributes, ReactNode, RefObject } from 'react';
import { createPortal } from 'react-dom';
import { css } from '@/ui/styled';
import type { ZoomImageSource } from './types';

const dialogStyle = css`
  &::backdrop {
    cursor: zoom-out;
    background-color: var(--colors-overlay-backgrounds);
  }

  &[open] {
    position: fixed;
    display: grid;
    place-items: center;
    width: 100dvw;
    max-width: none;
    height: 100dvh;
    max-height: none;
    padding: 0;
    margin: 0;
    overflow: hidden;
    background-color: transparent;
    border: 0;
  }

  &:not([open]) {
    display: none;
    pointer-events: none;
  }
`;

const dialogImageButtonStyle = css`
  display: contents;
  cursor: zoom-out;
`;

const dialogImageStyle = css`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
`;

/**
 * Enter または Space キーで dialog 背景をクリックしたように動作させる
 * バブリングで子要素からのイベントが到達した場合は無視する
 */
function handleDialogKeyDown(event: React.KeyboardEvent<HTMLDialogElement>, onClose: () => void): void {
  if (event.key === 'Enter' || event.key === ' ') {
    if (event.target === event.currentTarget) {
      event.preventDefault();
      onClose();
    }
  }
}

interface DialogProps {
  dialogRef: RefObject<HTMLDialogElement | null>;
  dialogImgRef: RefObject<HTMLImageElement | null>;
  label: string;
  closeLabel: string;
  isOpen: boolean;
  src: string;
  alt?: string;
  height?: ImgHTMLAttributes<HTMLImageElement>['height'];
  width?: ImgHTMLAttributes<HTMLImageElement>['width'];
  zoomImg?: ZoomImageSource;
  onClose: () => void;
  onCancel: (event: React.SyntheticEvent<HTMLDialogElement>) => void;
}

/**
 * ズームダイアログコンポーネント
 *
 * View Transitions API によるアニメーション付きの画像ズーム表示用モーダル。
 */
export function Dialog({
  dialogRef,
  dialogImgRef,
  label,
  closeLabel,
  isOpen,
  zoomImg,
  src,
  alt,
  height,
  width,
  onClose,
  onCancel,
}: DialogProps): ReactNode {
  const { dialogProps } = useDialog(
    {
      'aria-label': label,
    },
    dialogRef,
  );

  return createPortal(
    <FocusScope autoFocus={isOpen} contain={isOpen} restoreFocus>
      <dialog
        {...dialogProps}
        className={dialogStyle}
        onCancel={onCancel}
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
        onKeyDown={(e) => {
          handleDialogKeyDown(e, onClose);
        }}
        ref={dialogRef}
      >
        <button aria-label={closeLabel} className={dialogImageButtonStyle} onClick={onClose} type="button">
          {/* biome-ignore lint/performance/noImgElement: srcSet を含む原寸画像をダイアログでそのまま表示する */}
          <img
            alt={alt}
            className={dialogImageStyle}
            height={height}
            loading="eager"
            ref={dialogImgRef}
            src={zoomImg?.src || src}
            srcSet={zoomImg?.srcSet}
            width={width}
          />
        </button>
      </dialog>
    </FocusScope>,
    document.body,
  );
}
