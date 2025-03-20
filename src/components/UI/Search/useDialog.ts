'use client';

import { useCallback, useRef } from 'react';

export const useDialog = () => {
  const ref = useRef<HTMLDialogElement>(null);

  const openDialog = useCallback(() => {
    ref.current?.show?.();
  }, []);

  const closeDialog = useCallback(() => {
    ref.current?.close?.();
  }, []);

  return { ref, openDialog, closeDialog };
};
