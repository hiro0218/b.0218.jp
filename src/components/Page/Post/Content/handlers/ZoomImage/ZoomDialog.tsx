'use client';

import type { CSSProperties, ReactNode, RefObject } from 'react';
import { memo } from 'react';
import { createPortal } from 'react-dom';
import { css } from '@/ui/styled';
import type { ZoomImageSource } from '../types';
import type { ModalState } from './hooks/useImageZoom';

const dialogStyle = css`
  &::backdrop {
    cursor: zoom-out;
    background-color: var(--colors-overlay-backgrounds);
    transition:
      background-color 0.2s,
      opacity 0.2s;
  }

  &[data-closing='true']::backdrop {
    opacity: 0;
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
    background: transparent;
    border: 0;
  }

  /* 閉じている時は完全に非表示 */
  &:not([open]) {
    display: none;
    pointer-events: none;
  }

  /* UNLOADING中は操作をブロックしない */
  &[data-unloading='true'] {
    pointer-events: none;
  }

  @media (prefers-reduced-motion: reduce) {
    &::backdrop {
      transition: none;
    }
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
  /** ダイアログ要素への ref */
  dialogRef: RefObject<HTMLDialogElement | null>;
  /** モーダル画像要素への ref */
  modalImgRef: RefObject<HTMLImageElement | null>;
  /** ダイアログの aria-label */
  a11yLabel: string;
  /** モーダルがアクティブ（LOADING または LOADED）か */
  isModalActive: boolean;
  /** 現在のモーダル状態 */
  modalState: ModalState;
  /** モーダル画像に適用するスタイル */
  modalImgStyle: CSSProperties;
  /** 高解像度ズーム画像のソース */
  zoomImg?: ZoomImageSource;
  /** 元画像の src */
  src: string;
  /** 画像の alt テキスト */
  alt?: string;
  /** Escape キー押下時のハンドラ */
  onCancel: (event: React.SyntheticEvent<HTMLDialogElement>) => void;
  /** ダイアログクローズ時のハンドラ */
  onClose: () => void;
  /** コンテンツエリアクリック時のハンドラ */
  onContentClick: (event: React.MouseEvent<HTMLDivElement>) => void;
  /** 画像クリック時のハンドラ */
  onImageClick: () => void;
  /** 画像のトランジション完了時のハンドラ */
  onTransitionEnd: (event: React.TransitionEvent<HTMLImageElement>) => void;
}

/**
 * ズームダイアログコンポーネント
 *
 * 画像のズーム表示用のモーダルダイアログです。
 * Searchダイアログと同様のシンプルなbackdropスタイルを使用しています。
 */
function ZoomDialogComponent({
  dialogRef,
  modalImgRef,
  a11yLabel,
  isModalActive,
  modalState,
  modalImgStyle,
  zoomImg,
  src,
  alt,
  onCancel,
  onClose,
  onContentClick,
  onImageClick,
  onTransitionEnd,
}: ZoomDialogProps): ReactNode {
  return createPortal(
    <dialog
      aria-label={a11yLabel}
      className={dialogStyle}
      data-closing={!isModalActive}
      data-unloading={modalState === 'UNLOADING'}
      onCancel={onCancel}
      onClose={onClose}
      ref={dialogRef}
    >
      <div className={modalContentStyle} onClick={onContentClick}>
        <img
          alt={alt || ''}
          className={zoomedImageStyle}
          loading="lazy"
          onClick={onImageClick}
          onTransitionEnd={onTransitionEnd}
          ref={modalImgRef}
          src={zoomImg?.src || src}
          srcSet={zoomImg?.srcSet}
          style={modalImgStyle}
        />
      </div>
    </dialog>,
    document.body,
  );
}

export const ZoomDialog = memo(ZoomDialogComponent);
