import { useCallback, useEffect } from 'react';
import type { BaseKeyboardOptions } from './types';
import { isActivationKey, isEscapeKey } from './utils';

/**
 * モーダル用キーボードhookのオプション
 */
interface UseModalKeyboardOptions extends BaseKeyboardOptions {
  /** モーダルを閉じる処理 */
  onClose: () => void;
  /** 確認アクション（オプション） */
  onConfirm?: () => void;
  /** Escapeキーでの閉じるを有効にするか */
  closeOnEscape?: boolean;
  /** Enter/Spaceキーでの確認を有効にするか */
  confirmOnEnter?: boolean;
}

/**
 * モーダル/ダイアログ用のキーボード操作hook
 *
 * @description
 * モーダルやダイアログのキーボード操作を管理するための専用hookです。
 * Escapeキーでの閉じる、Enter/Spaceキーでの確認など、
 * モーダル固有のキーボード操作を簡単に実装できます。
 *
 * @example
 * ```typescript
 * const { isHandlingKey } = useModalKeyboard({
 *   onClose: closeModal,
 *   onConfirm: submitForm,
 *   isEnabled: isModalOpen,
 *   closeOnEscape: true,
 *   confirmOnEnter: true,
 * });
 * ```
 *
 * @param options モーダルキーボードの設定
 * @returns キーボード処理状態
 */
export function useModalKeyboard(options: UseModalKeyboardOptions) {
  const {
    onClose,
    onConfirm,
    isEnabled = true,
    containerRef,
    isGlobal = false,
    useCapture = false,
    closeOnEscape = true,
    confirmOnEnter = false,
  } = options;

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!isEnabled) return;

      // containerRefが指定されている場合、その外側のイベントは無視する
      if (containerRef?.current && !containerRef.current.contains(event.target as Node)) {
        return;
      }

      if (closeOnEscape && isEscapeKey(event.key)) {
        event.preventDefault();
        event.stopPropagation();
        onClose();
        return;
      }

      if (confirmOnEnter && onConfirm && isActivationKey(event.key)) {
        // フォーム要素内のEnterキーは通常の動作（フォーム送信など）を優先する
        const target = event.target as HTMLElement;
        const isFormElement =
          target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT';

        if (!isFormElement || event.key === ' ') {
          event.preventDefault();
          event.stopPropagation();
          onConfirm();
        }
      }
    },
    [onClose, onConfirm, isEnabled, containerRef, closeOnEscape, confirmOnEnter],
  );

  useEffect(() => {
    if (!isEnabled) return;

    const targetElement = isGlobal ? document : containerRef?.current;
    if (!targetElement) return;

    targetElement.addEventListener('keydown', handleKeyDown, { capture: useCapture });

    return () => {
      targetElement.removeEventListener('keydown', handleKeyDown, { capture: useCapture });
    };
  }, [handleKeyDown, isEnabled, isGlobal, containerRef, useCapture]);

  return {
    isHandlingKey: isEnabled,
  };
}
