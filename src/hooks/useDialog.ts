import { useCallback, useRef } from 'react';

export const useDialog = <T extends HTMLDialogElement>() => {
  const ref = useRef<T>(null);

  const open = useCallback(() => {
    ref.current?.show?.();
  }, []);

  const close = useCallback(() => {
    ref.current?.close?.();
  }, []);

  const toggle = useCallback(() => {
    const dialog = ref.current;
    if (dialog?.open) {
      dialog.close();
    } else {
      dialog?.show?.();
    }
  }, []);

  return {
    ref,
    open,
    close,
    toggle,
    isOpen: ref.current?.open ?? false,
  } as const;
};
