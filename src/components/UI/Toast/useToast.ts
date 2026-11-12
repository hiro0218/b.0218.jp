'use client';

import { useCallback, useState } from 'react';
import { useTimeout } from '@/hooks/useTimeout';

const TOAST_DURATION_MS = 2000;

export const useToast = (initialMessage: string) => {
  const [message, setMessage] = useState(initialMessage);
  const [isVisible, setIsVisible] = useState(false);
  const { schedule } = useTimeout();

  /**
   * トーストを表示して自動消去タイマーを開始
   * 既に表示中の場合は表示時間をリセットして延長する
   * @param overrideMessage - 指定時はこのメッセージを表示、未指定時は initialMessage に戻す
   */
  const showToast = useCallback(
    (overrideMessage?: string) => {
      setMessage(overrideMessage ?? initialMessage);
      setIsVisible(true);
      schedule(() => setIsVisible(false), TOAST_DURATION_MS);
    },
    [initialMessage, schedule],
  );

  /**
   * 待機中のタイマーを取り消さない。残ったタイマーは後から setIsVisible(false) を呼ぶだけで、すでに非表示なので何も変わらない。
   * 次の showToast は schedule が張り直す。
   */
  const hideToast = useCallback(() => {
    setIsVisible(false);
  }, []);

  return { showToast, hideToast, message, isVisible };
};
