'use client';

import { useCallback, useRef, useState } from 'react';

export const useToast = (message: string, duration = 2000) => {
  const ref = useRef<HTMLDivElement>(null);
  const [toastMessage] = useState(message);

  const hideToast = useCallback(() => {
    ref.current?.setAttribute('aria-hidden', 'false');
  }, []);

  const showToast = useCallback(() => {
    ref.current?.setAttribute('aria-hidden', 'true');

    setTimeout(() => {
      hideToast();
    }, duration);
  }, [hideToast, duration]);

  return { ref, showToast, hideToast, toastMessage };
};
