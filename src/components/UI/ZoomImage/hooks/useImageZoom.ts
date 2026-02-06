'use client';

import type { RefObject } from 'react';
import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';

interface UseImageZoomOptions {
  hasObjectFit?: boolean;
  minImageSize?: number;
}

interface UseImageZoomReturn {
  imgRef: RefObject<HTMLImageElement | null>;
  dialogRef: RefObject<HTMLDialogElement | null>;
  dialogImgRef: RefObject<HTMLImageElement | null>;
  canZoom: boolean;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  handleImageLoad: () => void;
}

/**
 * View Transition 対応のフォールバック付きラッパー
 *
 * `document.startViewTransition` が利用可能であればトランジション付きで実行し、
 * 非対応ブラウザでは callback を直接実行する。
 */
function startViewTransition(callback: () => void): ViewTransition | undefined {
  if (document.startViewTransition) {
    return document.startViewTransition(callback);
  }
  callback();
  return undefined;
}

/**
 * View Transitions API ベースの画像ズーム機能を提供
 */
export function useImageZoom(options: UseImageZoomOptions = {}): UseImageZoomReturn {
  const { hasObjectFit = false, minImageSize = 100 } = options;
  const viewTransitionName = `zoom-image-${useId().replace(/:/g, '')}`;

  const [imageLoaded, setImageLoaded] = useState(false);
  const [canZoom, setCanZoom] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const dialogImgRef = useRef<HTMLImageElement>(null);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  const open = useCallback(() => {
    if (!canZoom || !imgRef.current || !dialogRef.current || !dialogImgRef.current) return;

    const sourceImg = imgRef.current;
    const dialog = dialogRef.current;
    const dialogImg = dialogImgRef.current;

    if (!document.startViewTransition) {
      dialog.showModal();
      setIsOpen(true);
      return;
    }

    sourceImg.style.viewTransitionName = viewTransitionName;
    startViewTransition(() => {
      sourceImg.style.viewTransitionName = '';
      dialogImg.style.viewTransitionName = viewTransitionName;
      dialog.showModal();
    });

    setIsOpen(true);
  }, [canZoom, viewTransitionName]);

  const close = useCallback(() => {
    const dialog = dialogRef.current;
    if (!imgRef.current || !dialog || !dialogImgRef.current || !dialog.open) return;

    const sourceImg = imgRef.current;
    const dialogImg = dialogImgRef.current;

    if (!document.startViewTransition) {
      dialogImg.style.viewTransitionName = '';
      sourceImg.style.viewTransitionName = '';
      dialog.close();
      setIsOpen(false);
      return;
    }

    // 「old」スナップショット用に viewTransitionName を明示的に設定
    dialogImg.style.viewTransitionName = viewTransitionName;

    // ソース画像の親ボタンは isOpen 中 visibility: hidden のため、
    // View Transition の「new」スナップショットで visible にする必要がある
    const triggerButton = sourceImg.closest('button');

    const transition = startViewTransition(() => {
      dialogImg.style.viewTransitionName = '';
      sourceImg.style.viewTransitionName = viewTransitionName;
      if (triggerButton) triggerButton.style.visibility = 'visible';
      dialog.close();
    });

    if (transition) {
      transition.finished.finally(() => {
        sourceImg.style.viewTransitionName = '';
        if (triggerButton) triggerButton.style.visibility = '';
        setIsOpen(false);
      });
    } else {
      sourceImg.style.viewTransitionName = '';
      setIsOpen(false);
    }
  }, [viewTransitionName]);

  // ズーム可否判定（画像ロード時に一度だけチェック）
  useEffect(() => {
    if (hasObjectFit) {
      setCanZoom(false);
      return;
    }

    if (!imageLoaded || !imgRef.current) {
      setCanZoom(false);
      return;
    }

    const { naturalWidth, naturalHeight } = imgRef.current;
    setCanZoom(naturalWidth >= minImageSize || naturalHeight >= minImageSize);
  }, [hasObjectFit, imageLoaded, minImageSize]);

  // 既にロード済みの画像を検出
  useLayoutEffect(() => {
    const img = imgRef.current;
    if (img && !imageLoaded && img.complete && img.naturalWidth) {
      setImageLoaded(true);
    }
  }, [imageLoaded]);

  return {
    imgRef,
    dialogRef,
    dialogImgRef,
    canZoom,
    isOpen,
    open,
    close,
    handleImageLoad,
  };
}
