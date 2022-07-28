import { useCallback, useRef } from 'react';

export const useModal = () => {
  const ref = useRef<HTMLDialogElement>(null);

  const openDialog = useCallback(() => {
    ref.current?.showModal?.();
  }, []);

  const closeDialog = useCallback(() => {
    ref.current?.close?.();
  }, []);

  return { ref, openDialog, closeDialog };
};
