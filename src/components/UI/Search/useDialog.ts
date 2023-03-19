import { useCallback, useRef } from 'react';

import { useLockedBody } from '@/hooks/useLockedBody';

export const useDialog = () => {
  const ref = useRef<HTMLDialogElement>(null);
  const [isLocked, setLocked] = useLockedBody(false);

  const openDialog = useCallback(() => {
    setLocked(true);
    ref.current?.show?.();
  }, [setLocked]);

  const closeDialog = useCallback(() => {
    setLocked(false);
    ref.current?.close?.();
  }, [setLocked]);

  return { ref, isLocked, openDialog, closeDialog };
};
