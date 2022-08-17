import { useCallback, useRef } from 'react';

import { useLockedBody } from '@/hooks/useLockedBody';

export const useModal = () => {
  const ref = useRef<HTMLDialogElement>(null);
  const [, setLocked] = useLockedBody(false);

  const openDialog = useCallback(() => {
    setLocked(true);
    ref.current?.showModal?.();
  }, [setLocked]);

  const closeDialog = useCallback(() => {
    setLocked(false);
    ref.current?.close?.();
  }, [setLocked]);

  return { ref, openDialog, closeDialog };
};
