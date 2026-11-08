'use client';

import type { RefObject } from 'react';
import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import type { ImageDimensions } from '../types';

interface UseImageZoomOptions {
  imgRef: RefObject<HTMLImageElement | null>;
  /** 実寸の幅か高さがこの値(px)以上の画像だけをズームできる */
  minImageSize: number;
}

interface UseImageZoomReturn {
  dialogRef: RefObject<HTMLDialogElement | null>;
  dialogImgRef: RefObject<HTMLImageElement | null>;
  imageSize: ImageDimensions | null;
  canZoom: boolean;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  handleImageLoad: () => void;
}

/** base/index.css の ::view-transition-*(zoom-image) と対応する固定名。modal で同時に 1 つしか開かないため instance ごとの一意化は不要である */
const VIEW_TRANSITION_NAME = 'zoom-image';

function runWhenTransitionSettles(transition: ViewTransition, callback: () => void): void {
  void transition.finished.then(callback, callback);
}

function clearViewTransitionNames(...elements: HTMLElement[]): void {
  for (const element of elements) {
    element.style.viewTransitionName = '';
  }
}

/**
 * showModal / close を try/catch で囲まない。dialog が DOM から外れた状態でしか投げず、この hook は
 * dialogRef が付いている間しか呼ばない。jsdom に dialog のメソッドが無い問題は、テスト側でスタブして解く。
 */
export function useImageZoom({ imgRef, minImageSize }: UseImageZoomOptions): UseImageZoomReturn {
  const [loadedImageSize, setLoadedImageSize] = useState<ImageDimensions | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const dialogImgRef = useRef<HTMLImageElement>(null);
  const isTransitioning = useRef(false);

  const canZoom =
    loadedImageSize !== null && (loadedImageSize.width >= minImageSize || loadedImageSize.height >= minImageSize);

  const handleImageLoad = useCallback(() => {
    const img = imgRef.current;
    if (!img) return;

    setLoadedImageSize({
      height: img.naturalHeight,
      width: img.naturalWidth,
    });
  }, [imgRef]);

  // load だけを待たない。hydration より前に読み込みが終わった画像は load が来ないため、取り付けの時点でも読む
  useLayoutEffect(() => {
    const img = imgRef.current;
    if (img?.complete && img.naturalWidth) handleImageLoad();
  }, [imgRef, handleImageLoad]);

  // 開閉を示す ref を別に持たない。isOpen と dialog.open に続く 3 つ目の写しになり、書き込みの漏れで食い違う
  // canZoom を確かめない。トリガーと Dialog は canZoom のときだけ描画され、Dialog が無ければ下の ref の確認で止まる
  const open = useCallback(() => {
    if (isTransitioning.current) return;
    if (!imgRef.current || !dialogRef.current || !dialogImgRef.current) return;

    const sourceImg = imgRef.current;
    const dialog = dialogRef.current;
    const dialogImg = dialogImgRef.current;

    if (dialog.open) return;

    if (!document.startViewTransition) {
      dialog.showModal();
      setIsOpen(true);
      return;
    }

    isTransitioning.current = true;
    sourceImg.style.viewTransitionName = VIEW_TRANSITION_NAME;

    const transition = document.startViewTransition(() => {
      sourceImg.style.viewTransitionName = '';
      dialogImg.style.viewTransitionName = VIEW_TRANSITION_NAME;
      dialog.showModal();
      setIsOpen(true);
    });

    runWhenTransitionSettles(transition, () => {
      isTransitioning.current = false;
      clearViewTransitionNames(sourceImg, dialogImg);
      if (!dialog.open) setIsOpen(false);
    });
  }, [imgRef]);

  const close = useCallback(() => {
    if (isTransitioning.current) return;

    const dialog = dialogRef.current;
    if (!imgRef.current || !dialog || !dialogImgRef.current) return;

    const sourceImg = imgRef.current;
    const dialogImg = dialogImgRef.current;

    // cancel を経ずに dialog が閉じられた場合（CloseWatcher の強制 close など）は状態だけ同期する
    if (!dialog.open) {
      clearViewTransitionNames(sourceImg, dialogImg);
      setIsOpen(false);
      return;
    }

    if (!document.startViewTransition) {
      dialog.close();
      clearViewTransitionNames(sourceImg, dialogImg);
      setIsOpen(false);
      return;
    }

    isTransitioning.current = true;

    // 「old」スナップショット用に viewTransitionName を明示的に設定
    dialogImg.style.viewTransitionName = VIEW_TRANSITION_NAME;

    const transition = document.startViewTransition(() => {
      dialogImg.style.viewTransitionName = '';
      sourceImg.style.viewTransitionName = VIEW_TRANSITION_NAME;
      dialog.close();
    });

    runWhenTransitionSettles(transition, () => {
      isTransitioning.current = false;
      clearViewTransitionNames(sourceImg, dialogImg);
      if (!dialog.open) setIsOpen(false);
    });
  }, [imgRef]);

  return {
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
