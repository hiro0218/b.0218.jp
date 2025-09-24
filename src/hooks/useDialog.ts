import { useCallback, useEffect, useRef, useState } from 'react';

import { useBoolean } from './useBoolean';

interface UseDialogOptions {
  animated?: boolean;
  duration?: number;
}

export const useDialog = <T extends HTMLDialogElement>(options?: UseDialogOptions) => {
  const { animated = true, duration: baseDuration = 200 } = options ?? {};
  const ref = useRef<T>(null);
  const { value: isClosing, setTrue: setClosing, setFalse: setNotClosing } = useBoolean(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [duration, setDuration] = useState(baseDuration);

  useEffect(() => {
    if (!animated) return;

    const checkMotionPreference = () => {
      const prefersReducedMotion = window?.matchMedia('(prefers-reduced-motion: reduce)').matches;

      setDuration(prefersReducedMotion ? 0 : baseDuration);
    };

    checkMotionPreference();

    const mediaQuery = window?.matchMedia('(prefers-reduced-motion: reduce)');

    if (mediaQuery) {
      const handler = () => checkMotionPreference();
      mediaQuery.addEventListener('change', handler);

      return () => {
        mediaQuery.removeEventListener('change', handler);
      };
    }
  }, [animated, baseDuration]);

  const open = useCallback(() => {
    ref.current?.show?.();
  }, []);

  const close = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    if (animated && duration > 0) {
      setClosing();
      timerRef.current = setTimeout(() => {
        ref.current?.close?.();
        setNotClosing();
        timerRef.current = undefined;
      }, duration);
    } else {
      ref.current?.close?.();
    }
  }, [animated, duration, setClosing, setNotClosing]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const toggle = useCallback(() => {
    const dialog = ref.current;
    if (dialog?.open) {
      close();
    } else {
      dialog?.show?.();
    }
  }, [close]);

  return {
    ref,
    open,
    close,
    toggle,
    isOpen: ref.current?.open ?? false,
    isClosing: !!(animated && isClosing),
  } as const;
};
