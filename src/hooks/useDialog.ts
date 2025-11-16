import { useCallback } from 'react';
import type { OverlayTriggerProps } from 'react-stately';
import { useOverlayTriggerState } from 'react-stately';
import { useDialogElement } from './useDialogElement';
import { useMotionPreference } from './useMotionPreference';

interface UseDialogOptions extends Partial<OverlayTriggerProps> {
  animated?: boolean;
  duration?: number;
}

/**
 * ダイアログの開閉とアニメーションを管理する統合フック
 *
 * 関心の分離により以下のフックを統合：
 * - useMotionPreference: モーションプリファレンスの監視
 * - useDialogElement: HTMLDialogElement の制御
 * - useOverlayTriggerState: 状態管理（React Stately）
 *
 * @param options - animated: アニメーション有効化、duration: アニメーション時間、その他 React Stately のオプション
 * @returns ダイアログ制御のための ref、open/close メソッド、状態
 */
export const useDialog = <T extends HTMLDialogElement>(options?: UseDialogOptions) => {
  const { animated = true, duration: baseDuration = 200, ...overlayOptions } = options ?? {};

  const state = useOverlayTriggerState(overlayOptions);

  const duration = useMotionPreference({
    enabled: animated,
    baseDuration,
  });

  const dialogElement = useDialogElement<T>({
    isOpen: state.isOpen,
    onClose: state.close,
    duration: animated ? duration : 0,
  });

  const open = useCallback(() => {
    state.open();
    dialogElement.open();
  }, [state, dialogElement]);

  const close = useCallback(() => {
    dialogElement.close();
  }, [dialogElement]);

  return {
    ref: dialogElement.ref,
    open,
    close,
    isOpen: state.isOpen,
    isClosing: !!(animated && dialogElement.isClosing),
  } as const;
};
