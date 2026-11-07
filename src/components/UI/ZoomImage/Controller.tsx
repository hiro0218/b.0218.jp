'use client';

import type { SyntheticEvent } from 'react';
import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import type { Dialog } from './Dialog';
import { useImageZoom } from './hooks/useImageZoom';
import { TriggerButton } from './TriggerButton';
import type { ZoomImageSource } from './types';

type ControllerProps = {
  src: string;
  triggerLabel: string;
  dialogLabel: string;
  closeLabel: string;
  minImageSize: number;
  alt?: string;
  zoomImg?: ZoomImageSource;
};

const importDialog = () => import('./Dialog');

function getSourceImage(anchor: HTMLElement | null) {
  return anchor?.closest('[data-zoom-image]')?.querySelector<HTMLImageElement>('img[data-zoom-image-source]') ?? null;
}

export function Controller({
  alt,
  src,
  triggerLabel,
  dialogLabel,
  closeLabel,
  minImageSize,
  zoomImg,
}: ControllerProps) {
  const anchorRef = useRef<HTMLSpanElement>(null);
  const [LoadedDialog, setLoadedDialog] = useState<typeof Dialog | null>(null);
  const { dialogRef, dialogImgRef, imageSize, canZoom, isOpen, open, close, handleImageLoad, setImageElement } =
    useImageZoom({
      minImageSize,
    });

  useLayoutEffect(() => {
    const img = getSourceImage(anchorRef.current);
    setImageElement(img);

    if (!img) {
      return () => setImageElement(null);
    }

    img.addEventListener('load', handleImageLoad);

    return () => {
      img.removeEventListener('load', handleImageLoad);
      setImageElement(null);
    };
  }, [handleImageLoad, setImageElement]);

  const handleDialogCancel = useCallback(
    (event: SyntheticEvent<HTMLDialogElement>) => {
      event.preventDefault();
      close();
    },
    [close],
  );

  // Dialog は react-aria の FocusScope などを含み、記事ページの初期 JS の約 15 KB を占める。
  // ズームは操作してから必要になるため、トリガーへの hover / focus を合図に読み込み、読み込み後に描画する。
  // 押された場合は、描画(flushSync)まで終えてから open する。open はその押下の promise にだけつなぐ
  // (失敗した取得のあと別の hover が成功しても、押していない open が起きないようにする)。
  // Why not: canZoom になった時点で常に描画する(従来)。ズーム画像のない記事も含め、全記事がこの JS を読むため。
  // Why not: React.lazy と Suspense。fallback を出すと、読み込みが終わっても React の throttle で
  // 表示まで最低 300 ms 待たされる(実測。hover なしの初回ズームが約 320 ms 遅れた)ため、完了を state で受ける。
  // Why not: Dialog を値で import する。import type だけで取り込む(静的 import は全記事の初期 JS に戻る)。
  // Why not: 失敗を未処理の拒否のままにする。chunk の 404 でコンソールが落ち、押しても何も起きない。
  const loadDialog = () => {
    // 描画済みなら再取得も flushSync もしない。focus の戻りや hover のたびに同期フラッシュしないため
    if (dialogRef.current) return Promise.resolve();

    return importDialog().then((m) => {
      if (dialogRef.current) return;
      flushSync(() => setLoadedDialog(() => m.Dialog));
    });
  };

  const prefetchDialog = () => {
    // 失敗の記録は押下側に任せる。ここでも出すと、続く click と二重になる
    void loadDialog().catch(() => undefined);
  };

  // Dialog が未描画(読み込み中)の間は dialogRef が無く開けないため、読み込んで描画してから開く
  const handleZoomIn = () => {
    if (dialogRef.current) {
      open();
      return;
    }
    loadDialog()
      .then(open)
      .catch((error: unknown) => {
        console.error('Failed to load ZoomImage dialog:', error);
      });
  };

  return (
    <>
      <span data-zoom-image-controller="" hidden ref={anchorRef} />
      {canZoom ? (
        <TriggerButton isOpen={isOpen} label={triggerLabel} onPrefetch={prefetchDialog} zoomIn={handleZoomIn} />
      ) : null}
      {canZoom && LoadedDialog ? (
        <LoadedDialog
          alt={alt}
          closeLabel={closeLabel}
          dialogImgRef={dialogImgRef}
          dialogRef={dialogRef}
          imageSize={imageSize}
          isOpen={isOpen}
          label={dialogLabel}
          onCancel={handleDialogCancel}
          onClose={close}
          src={src}
          zoomImg={zoomImg}
        />
      ) : null}
    </>
  );
}
