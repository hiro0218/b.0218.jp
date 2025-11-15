import { useCallback, useEffect, useRef, useState } from 'react';

interface UseDialogElementOptions {
  isOpen: boolean;
  onClose: () => void;
  duration: number;
}

interface UseDialogElementResult<T extends HTMLDialogElement> {
  ref: React.RefObject<T>;
  open: () => void;
  close: () => void;
  isClosing: boolean;
}

/**
 * HTMLDialogElement の開閉を制御する
 * アニメーション付きクローズをサポート
 *
 * @param options - isOpen: 開閉状態、onClose: クローズコールバック、duration: アニメーション時間
 * @returns ダイアログ ref、open/close メソッド、クロージング状態
 */
export function useDialogElement<T extends HTMLDialogElement>({
  isOpen,
  onClose,
  duration,
}: UseDialogElementOptions): UseDialogElementResult<T> {
  const ref = useRef<T>(null);
  const [isClosing, setIsClosing] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // isOpen が変化したら dialog 要素を開く
  useEffect(() => {
    if (!isOpen) return;

    let frameId: number | undefined;

    const checkAndOpen = () => {
      const dialog = ref.current;
      if (dialog && !dialog.open) {
        dialog.show();
      } else if (!ref.current) {
        // ref.current がまだ null の場合、次のフレームで再チェック
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
    ref.current?.show();
  }, []);

  const close = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    if (duration > 0) {
      setIsClosing(true);
      timerRef.current = setTimeout(() => {
        ref.current?.close?.();
        setIsClosing(false);
        onClose();
        timerRef.current = undefined;
      }, duration);
    } else {
      ref.current?.close?.();
      onClose();
    }
  }, [duration, onClose]);

  // クリーンアップ
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
    isClosing,
  };
}
