'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect';

/**
 * 自動消去機能付きトースト通知の状態管理
 * ユーザーの明示的な操作なしに一定時間後に自動で非表示になるため、
 * UIの邪魔にならずユーザビリティを向上させる
 * @param initialMessage - トーストに表示するテキスト内容
 * @param duration - 自動消去までの遅延時間（ミリ秒、デフォルト: 2000）
 * @returns トーストの状態と制御関数のオブジェクト
 * @example
 * const { showToast, hideToast, isVisible } = useToast('成功しました！', 3000);
 * showToast(); // 3秒間トーストを表示
 */
export const useToast = (initialMessage: string, duration = 2000) => {
  const ref = useRef<HTMLDivElement>(null);
  const [message] = useState(initialMessage);
  const [isVisible, setIsVisible] = useState(false);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const delayRef = useRef<number | null>(isVisible ? duration : null);

  const dismiss = useCallback(() => {
    setIsVisible(false);
  }, []);

  const dismissRef = useRef(dismiss);

  useIsomorphicLayoutEffect(() => {
    dismissRef.current = dismiss;
  }, [dismiss]);

  useIsomorphicLayoutEffect(() => {
    delayRef.current = isVisible ? duration : null;
  }, [isVisible, duration]);

  const cancel = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const reset = useCallback(() => {
    cancel();
    const currentDelay = delayRef.current;
    if (currentDelay !== null && currentDelay >= 0) {
      timerRef.current = setTimeout(() => {
        dismissRef.current();
      }, currentDelay);
    }
  }, [cancel]);

  useEffect(() => {
    const delay = isVisible ? duration : null;

    if (delay === null || delay < 0) {
      return;
    }

    const id = setTimeout(() => {
      dismissRef.current();
    }, delay);

    timerRef.current = id;

    return () => {
      clearTimeout(id);
    };
  }, [isVisible, duration]);

  /**
   * トーストを表示して自動消去タイマーを開始
   * 既に表示中の場合は表示時間をリセットして延長する
   */
  const showToast = useCallback(() => {
    setIsVisible(true);
    reset();
  }, [reset]);

  /**
   * トーストを即座に非表示にして待機中のタイマーをキャンセル
   * ユーザーが手動で閉じた場合の自動消去を防ぐため
   */
  const hideToast = useCallback(() => {
    dismiss();
    cancel();
  }, [dismiss, cancel]);

  return { ref, showToast, hideToast, message, isVisible };
};
