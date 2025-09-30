import { useCallback, useEffect, useRef, useState } from 'react';

import { useBoolean } from './useBoolean';

interface UseDialogOptions {
  animated?: boolean;
  duration?: number;
}

export const useDialog = <T extends HTMLDialogElement>(options?: UseDialogOptions) => {
  const { animated = true, duration: baseDuration = 200 } = options ?? {};
  const ref = useRef<T>(null);
  const { value: isOpen, setTrue: setOpen, setFalse: setClose } = useBoolean(false);
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

  // isOpenが変化したらdialog要素を開閉
  useEffect(() => {
    if (!isOpen) return;

    let frameId: number | undefined;

    const checkAndOpen = () => {
      const dialog = ref.current;
      if (dialog && !dialog.open) {
        dialog.show();
      } else if (!ref.current) {
        // ref.currentがまだnullの場合、次のフレームで再チェック
        frameId = requestAnimationFrame(checkAndOpen);
      }
    };

    frameId = requestAnimationFrame(checkAndOpen);

    return () => {
      if (frameId !== undefined) {
        cancelAnimationFrame(frameId);
      }
    };
  }, [isOpen]);

  const open = useCallback(() => {
    setOpen();
  }, [setOpen]);

  const close = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    if (animated && duration > 0) {
      setClosing();
      timerRef.current = setTimeout(() => {
        ref.current?.close?.();
        setNotClosing();
        setClose();
        timerRef.current = undefined;
      }, duration);
    } else {
      ref.current?.close?.();
      setClose();
    }
  }, [animated, duration, setClosing, setNotClosing, setClose]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return {
    ref,
    open,
    close,
    isOpen,
    isClosing: !!(animated && isClosing),
  } as const;
};
