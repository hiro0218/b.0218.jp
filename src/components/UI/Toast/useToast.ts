'use client';

import { useCallback, useRef, useState } from 'react';

import { useBoolean } from '@/hooks/useBoolean';
import { useTimeout } from '@/hooks/useTimeout';

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
  const { value: isVisible, setTrue: setVisible, setFalse: setInvisible } = useBoolean(false);

  // 再レンダリング時に関数参照が変わることでuseEffectが不要に再実行されるのを防ぐ
  const dismiss = useCallback(() => {
    setInvisible();
  }, [setInvisible]);

  // トースト表示中のみタイマーを有効化し、非表示時は無駄なタイマーを防ぐ
  const { cancel, reset } = useTimeout(dismiss, isVisible ? duration : null);

  /**
   * トーストを表示して自動消去タイマーを開始
   * 既に表示中の場合は表示時間をリセットして延長する
   */
  const showToast = useCallback(() => {
    setVisible();
    // 新しい表示期間を開始するためタイマーをリセット
    reset();
  }, [reset, setVisible]);

  /**
   * トーストを即座に非表示にして待機中のタイマーをキャンセル
   * ユーザーが手動で閉じた場合の自動消去を防ぐため
   */
  const hideToast = useCallback(() => {
    dismiss();
    // 即座に消去するため待機中のタイマーをキャンセル
    cancel();
  }, [dismiss, cancel]);

  return { ref, showToast, hideToast, message, isVisible };
};
