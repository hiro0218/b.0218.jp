'use client';

import { useDialog } from '@react-aria/dialog';
import { FocusScope } from '@react-aria/focus';
import type { ReactNode, RefObject } from 'react';
import { createPortal } from 'react-dom';
import { css } from '@/ui/styled';
import type { ImageDimensions } from './types';

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
  display: block;
  max-width: 100%;
  max-height: 100%;
  padding: 0;
  cursor: zoom-out;
  background-color: transparent;
  border: 0;

  &:focus-visible {
    outline: var(--border-widths-medium) solid var(--colors-focus-ring);
    outline-offset: 2px;
  }
`;

const dialogImageStyle = css`
  display: block;
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
  imageSize?: ImageDimensions | null;
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
  imageSize,
  src,
  alt,
  onClose,
  onCancel,
}: DialogProps): ReactNode {
  const { dialogProps } = useDialog(
    {
      'aria-label': label,
    },
    dialogRef,
  );

  // FocusScope の autoFocus={isOpen} を使わず、開いたときのフォーカスは showModal に任せる。
  // FocusScope は最初の描画の値しか読まず、Dialog は先読みで閉じたまま描画されるため、autoFocus は効かない。
  return createPortal(
    <FocusScope contain={isOpen} restoreFocus>
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
          <img
            alt={alt}
            className={dialogImageStyle}
            height={imageSize?.height}
            loading="eager"
            ref={dialogImgRef}
            src={src}
            width={imageSize?.width}
          />
        </button>
      </dialog>
    </FocusScope>,
    document.body,
  );
}
