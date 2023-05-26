import { useCallback, useRef } from 'react';

import { useLockedBody } from '@/hooks/useLockedBody';

export const useDialog = () => {
  const ref = useRef<HTMLDialogElement>(null);
  const [isLocked, setIsLocked] = useLockedBody(false);

  const openDialog = useCallback(() => {
    setIsLocked(true);
    ref.current?.show?.();
  }, [setIsLocked]);

  const closeDialog = useCallback(() => {
    setIsLocked(false);
    ref.current?.close?.();
  }, [setIsLocked]);

  return { ref, isLocked, openDialog, closeDialog };
};
