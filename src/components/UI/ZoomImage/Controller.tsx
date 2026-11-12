'use client';

import type { ImgHTMLAttributes, SyntheticEvent } from 'react';
import { useCallback, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import type { Dialog } from './Dialog';
import { useImageZoom } from './hooks/useImageZoom';
import { TriggerButton } from './TriggerButton';

type ControllerProps = ImgHTMLAttributes<HTMLImageElement> & {
  src: string;
  triggerLabel: string;
  dialogLabel: string;
  closeLabel: string;
  minImageSize: number;
};

const importDialog = () => import('./Dialog');

// サーバー側で描画した img を data 属性と目印の要素から探さず、Controller の中で描画する。探すと、描画側と探す側が属性名だけでつながり、片方の変更で黙って壊れる
export function Controller({
  alt,
  src,
  triggerLabel,
  dialogLabel,
  closeLabel,
  minImageSize,
  ...imgProps
}: ControllerProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [LoadedDialog, setLoadedDialog] = useState<typeof Dialog | null>(null);
  const { dialogRef, dialogImgRef, imageSize, canZoom, isOpen, open, close, handleImageLoad } = useImageZoom({
    imgRef,
    minImageSize,
  });

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
  // canZoom になった時点で常に描画する形にも、Dialog を値で import する形にもしない(import type だけで取り込む)。どちらも、ズーム画像のない記事も含め、全記事の初期 JS に Dialog が入る。
  // React.lazy と Suspense を使わない。fallback を出すと、読み込みが終わっても React の throttle で
  // 表示まで最低 300 ms 待たされる(実測。hover なしの初回ズームが約 320 ms 遅れた)ため、完了を state で受ける。
  // 失敗を未処理の拒否のままにしない。chunk の 404 でコンソールが落ち、押しても何も起きない。
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
      <img alt={alt} src={src} {...imgProps} onLoad={handleImageLoad} ref={imgRef} />
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
        />
      ) : null}
    </>
  );
}
