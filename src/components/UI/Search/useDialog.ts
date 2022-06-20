import { useCallback, useRef } from 'react';

export const useModal = () => {
  const ref = useRef<HTMLDialogElement>(null);

  const openDialog = useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    ref.current?.showModal();
  }, []);

  const closeDialog = useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    ref.current?.close();
  }, []);

  return { ref, openDialog, closeDialog };
};
