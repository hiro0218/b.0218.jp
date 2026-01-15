'use client';

import type { CSSProperties, ReactNode, RefObject } from 'react';
import { memo } from 'react';
import { createPortal } from 'react-dom';
import { css } from '@/ui/styled';
import type { ZoomImageSource } from '../types';

const dialogStyle = css`
  &::backdrop {
    display: none;
  }

  &[open] {
    position: fixed;
    width: 100vw;
    width: 100dvw;
    max-width: none;
    height: 100vh;
    height: 100dvh;
    max-height: none;
    padding: 0;
    margin: 0;
    overflow: hidden;
    pointer-events: all;
    background: transparent;
    border: 0;
  }
`;

const overlayStyle = css`
  position: absolute;
  inset: 0;
  backdrop-filter: blur(4px);
  transition: background-color 0.2s;

  &[data-zoom-modal-overlay='hidden'] {
    background-color: rgba(0, 0, 0, 0);
  }

  &[data-zoom-modal-overlay='visible'] {
    background-color: var(--colors-gray-a-11);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

const modalContentStyle = css`
  position: relative;
  width: 100%;
  height: 100%;
`;

const zoomedImageStyle = css`
  position: absolute;
  cursor: zoom-out;
  image-rendering: high-quality;
  transform-origin: top left;
  transition: transform 0.2s;

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

interface ZoomDialogProps {
  dialogRef: RefObject<HTMLDialogElement | null>;
  modalImgRef: RefObject<HTMLImageElement | null>;
  a11yLabel: string;
  isModalActive: boolean;
  modalImgStyle: CSSProperties;
  zoomImg?: ZoomImageSource;
  src: string;
  alt?: string;
  onCancel: (event: React.SyntheticEvent<HTMLDialogElement>) => void;
  onClose: () => void;
  onContentClick: (event: React.MouseEvent<HTMLDivElement>) => void;
  onImageClick: () => void;
  onImageKeyDown: (event: React.KeyboardEvent) => void;
  onTransitionEnd: (event: React.TransitionEvent<HTMLImageElement>) => void;
}

/**
 * ズームダイアログコンポーネント
 *
 * 画像のズーム表示用のモーダルダイアログです。
 */
function ZoomDialogComponent({
  dialogRef,
  modalImgRef,
  a11yLabel,
  isModalActive,
  modalImgStyle,
  zoomImg,
  src,
  alt,
  onCancel,
  onClose,
  onContentClick,
  onImageClick,
  onImageKeyDown,
  onTransitionEnd,
}: ZoomDialogProps): ReactNode {
  return createPortal(
    <dialog aria-label={a11yLabel} className={dialogStyle} onCancel={onCancel} onClose={onClose} ref={dialogRef}>
      <div
        className={overlayStyle}
        data-zoom-modal-overlay={isModalActive ? 'visible' : 'hidden'}
        role="presentation"
      />
      <div className={modalContentStyle} onClick={onContentClick}>
        <img
          alt={alt || ''}
          className={zoomedImageStyle}
          loading="lazy"
          onClick={onImageClick}
          onKeyDown={onImageKeyDown}
          onTransitionEnd={onTransitionEnd}
          ref={modalImgRef}
          src={zoomImg?.src || src}
          srcSet={zoomImg?.srcSet}
          style={modalImgStyle}
          tabIndex={0}
        />
      </div>
    </dialog>,
    document.body,
  );
}

export const ZoomDialog = memo(ZoomDialogComponent);
