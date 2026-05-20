'use client';

import type { RefObject } from 'react';
import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import type { ImageDimensions } from '../types';

interface UseImageZoomOptions {
  hasObjectFit?: boolean;
  minImageSize?: number;
}

interface UseImageZoomReturn {
  imgRef: RefObject<HTMLImageElement | null>;
  dialogRef: RefObject<HTMLDialogElement | null>;
  dialogImgRef: RefObject<HTMLImageElement | null>;
  imageSize: ImageDimensions | null;
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

function runWhenTransitionSettles(transition: ViewTransition, callback: () => void): void {
  void transition.finished.then(callback, callback);
}

function clearViewTransitionNames(...elements: HTMLElement[]): void {
  for (const element of elements) {
    element.style.viewTransitionName = '';
  }
}

function showModalSafely(dialog: HTMLDialogElement): boolean {
  if (dialog.open) return true;

  try {
    dialog.showModal();
    return true;
  } catch {
    return false;
  }
}

function closeSafely(dialog: HTMLDialogElement): boolean {
  if (!dialog.open) return true;

  try {
    dialog.close();
    return true;
  } catch {
    return false;
  }
}

/**
 * View Transitions API ベースの画像ズーム機能を提供
 */
export function useImageZoom(options: UseImageZoomOptions = {}): UseImageZoomReturn {
  const { hasObjectFit = false, minImageSize = 100 } = options;
  const viewTransitionName = `zoom-image-${useId().replace(/:/g, '')}`;

  const [loadedImageSize, setLoadedImageSize] = useState<ImageDimensions | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const isOpenRef = useRef(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const dialogImgRef = useRef<HTMLImageElement>(null);
  const isTransitioning = useRef(false);
  const isMountedRef = useRef(true);

  const canZoom =
    !hasObjectFit &&
    loadedImageSize !== null &&
    (loadedImageSize.width >= minImageSize || loadedImageSize.height >= minImageSize);

  const handleImageLoad = useCallback(() => {
    const img = imgRef.current;
    if (!img) return;

    setLoadedImageSize({
      height: img.naturalHeight,
      width: img.naturalWidth,
    });
  }, []);

  const open = useCallback(() => {
    if (!canZoom || isOpenRef.current || isTransitioning.current) return;
    if (!imgRef.current || !dialogRef.current || !dialogImgRef.current) return;

    const sourceImg = imgRef.current;
    const dialog = dialogRef.current;
    const dialogImg = dialogImgRef.current;

    if (!document.startViewTransition) {
      const didOpen = showModalSafely(dialog);
      if (!didOpen) return;

      isOpenRef.current = true;
      setIsOpen(true);
      return;
    }

    isOpenRef.current = true;
    isTransitioning.current = true;
    sourceImg.style.viewTransitionName = viewTransitionName;

    let transition: ViewTransition | undefined;
    try {
      transition = startViewTransition(() => {
        sourceImg.style.viewTransitionName = '';
        dialogImg.style.viewTransitionName = viewTransitionName;
        const didOpen = showModalSafely(dialog);
        if (didOpen && isMountedRef.current) {
          setIsOpen(true);
        }
      });
    } catch {
      clearViewTransitionNames(sourceImg, dialogImg);
      isTransitioning.current = false;
      isOpenRef.current = false;
      if (isMountedRef.current) setIsOpen(false);
      return;
    }

    if (transition) {
      runWhenTransitionSettles(transition, () => {
        isTransitioning.current = false;
        clearViewTransitionNames(sourceImg, dialogImg);
        if (!dialog.open) {
          isOpenRef.current = false;
          if (isMountedRef.current) setIsOpen(false);
        }
      });
    } else {
      clearViewTransitionNames(sourceImg, dialogImg);
      isTransitioning.current = false;
    }
  }, [canZoom, viewTransitionName]);

  const close = useCallback(() => {
    if (isTransitioning.current) return;

    const dialog = dialogRef.current;
    if (!imgRef.current || !dialog || !dialogImgRef.current || !dialog.open) return;

    const sourceImg = imgRef.current;
    const dialogImg = dialogImgRef.current;

    if (!document.startViewTransition) {
      const didClose = closeSafely(dialog);
      if (!didClose) return;

      clearViewTransitionNames(sourceImg, dialogImg);
      isOpenRef.current = false;
      setIsOpen(false);
      return;
    }

    isTransitioning.current = true;

    // 「old」スナップショット用に viewTransitionName を明示的に設定
    dialogImg.style.viewTransitionName = viewTransitionName;

    // ソース画像の親ボタンは isOpen 中 visibility: hidden のため、
    // View Transition の「new」スナップショットで visible にする必要がある
    const triggerButton = sourceImg.closest('button');

    let transition: ViewTransition | undefined;
    try {
      transition = startViewTransition(() => {
        dialogImg.style.viewTransitionName = '';
        sourceImg.style.viewTransitionName = viewTransitionName;
        if (triggerButton) triggerButton.style.visibility = 'visible';
        closeSafely(dialog);
      });
    } catch {
      clearViewTransitionNames(sourceImg, dialogImg);
      if (triggerButton) triggerButton.style.visibility = '';
      isTransitioning.current = false;
      return;
    }

    if (transition) {
      runWhenTransitionSettles(transition, () => {
        isTransitioning.current = false;
        clearViewTransitionNames(sourceImg, dialogImg);
        if (triggerButton) triggerButton.style.visibility = '';
        if (dialog.open) return;

        isOpenRef.current = false;
        if (isMountedRef.current) setIsOpen(false);
      });
    } else {
      clearViewTransitionNames(sourceImg, dialogImg);
      isTransitioning.current = false;
      if (!dialog.open) {
        isOpenRef.current = false;
        setIsOpen(false);
      }
    }
  }, [viewTransitionName]);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // 既にロード済みの画像を検出
  useLayoutEffect(() => {
    const img = imgRef.current;
    if (img && loadedImageSize === null && img.complete && img.naturalWidth) {
      setLoadedImageSize({
        height: img.naturalHeight,
        width: img.naturalWidth,
      });
    }
  }, [loadedImageSize]);

  return {
    imgRef,
    dialogRef,
    dialogImgRef,
    imageSize: loadedImageSize,
    canZoom,
    isOpen,
    open,
    close,
    handleImageLoad,
  };
}
