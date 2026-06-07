'use client';

import type { SyntheticEvent } from 'react';
import { useCallback, useLayoutEffect, useRef } from 'react';
import useIsMounted from '@/hooks/useIsMounted';
import { Dialog } from './Dialog';
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
  const isMounted = useIsMounted();
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

  return (
    <>
      <span data-zoom-image-controller="" hidden ref={anchorRef} />
      {canZoom ? <TriggerButton isOpen={isOpen} label={triggerLabel} zoomIn={open} /> : null}
      {isMounted && canZoom ? (
        <Dialog
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
