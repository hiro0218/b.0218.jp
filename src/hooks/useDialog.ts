import { useCallback, useEffect, useRef, useState } from 'react';
import type { OverlayTriggerProps } from 'react-stately';
import { useOverlayTriggerState } from 'react-stately';

interface UseDialogOptions extends Partial<OverlayTriggerProps> {
  animated?: boolean;
  duration?: number;
}

/**
 * ダイアログの開閉とアニメーションを管理する統合フック
 *
 * @param options - animated: アニメーション有効化、duration: アニメーション時間、その他 React Stately のオプション
 * @returns ダイアログ制御のための ref、open/close メソッド、状態
 */
export const useDialog = <T extends HTMLDialogElement>(options?: UseDialogOptions) => {
  const { animated = true, duration: baseDuration = 200, ...overlayOptions } = options ?? {};

  const state = useOverlayTriggerState(overlayOptions);
  const ref = useRef<T>(null);
  const [isClosing, setIsClosing] = useState(false);
  const [duration, setDuration] = useState(baseDuration);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (!animated) {
      setDuration(0);
      return;
    }

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

  useEffect(() => {
    if (!state.isOpen) return;

    let frameId: number | undefined;

    const checkAndOpen = () => {
      const dialog = ref.current;
      if (dialog && !dialog.open) {
        dialog.show();
      } else if (!ref.current) {
        frameId = requestAnimationFrame(checkAndOpen);
      }
    };

    frameId = requestAnimationFrame(checkAndOpen);

    return () => {
      if (frameId !== undefined) {
        cancelAnimationFrame(frameId);
      }
    };
  }, [state.isOpen]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const openDialog = useCallback(() => {
    ref.current?.show();
  }, []);

  const closeDialog = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    if (duration > 0) {
      setIsClosing(true);
      timerRef.current = setTimeout(() => {
        ref.current?.close?.();
        setIsClosing(false);
        state.close();
        timerRef.current = undefined;
      }, duration);
    } else {
      ref.current?.close?.();
      state.close();
    }
  }, [duration, state]);

  const open = useCallback(() => {
    state.open();
    openDialog();
  }, [state, openDialog]);

  const close = useCallback(() => {
    closeDialog();
  }, [closeDialog]);

  return {
    ref,
    open,
    close,
    isOpen: state.isOpen,
    isClosing: !!(animated && isClosing),
  } as const;
};
