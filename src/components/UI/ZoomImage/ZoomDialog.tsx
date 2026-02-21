'use client';

import { useDialog } from '@react-aria/dialog';
import { FocusScope } from '@react-aria/focus';
import type { ReactNode, RefObject } from 'react';
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
    background: transparent;
    border: 0;
  }

  &:not([open]) {
    display: none;
    pointer-events: none;
  }
`;

const dialogImageStyle = css`
  max-width: 100%;
  max-height: 100%;
  cursor: zoom-out;
  object-fit: contain;
`;

/**
 * Enter または Space キーで画像をクリックしたように動作させる
 */
function handleImageKeyDown(event: React.KeyboardEvent<HTMLImageElement>, onClick: () => void): void {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    onClick();
  }
}

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

interface ZoomDialogProps {
  dialogRef: RefObject<HTMLDialogElement | null>;
  dialogImgRef: RefObject<HTMLImageElement | null>;
  a11yLabel: string;
  src: string;
  alt?: string;
  zoomImg?: ZoomImageSource;
  onClose: () => void;
  onCancel: (event: React.SyntheticEvent<HTMLDialogElement>) => void;
}

/**
 * ズームダイアログコンポーネント
 *
 * View Transitions API によるアニメーション付きの画像ズーム表示用モーダル。
 */
export function ZoomDialog({
  dialogRef,
  dialogImgRef,
  a11yLabel,
  zoomImg,
  src,
  alt,
  onClose,
  onCancel,
}: ZoomDialogProps): ReactNode {
  const { dialogProps } = useDialog(
    {
      'aria-label': a11yLabel,
    },
    dialogRef,
  );

  return createPortal(
    <FocusScope autoFocus contain restoreFocus>
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
        <img
          alt={alt}
          className={dialogImageStyle}
          loading="eager"
          onClick={onClose}
          onKeyDown={(e) => {
            handleImageKeyDown(e, onClose);
          }}
          ref={dialogImgRef}
          src={zoomImg?.src || src}
          srcSet={zoomImg?.srcSet}
          tabIndex={0}
        />
      </dialog>
    </FocusScope>,
    document.body,
  );
}
