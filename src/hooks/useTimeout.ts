'use client';

import { useCallback, useEffect, useRef } from 'react';

/**
 * useTimeoutフックの戻り値型定義
 * タイマー制御に必要なメソッドを提供
 */
interface UseTimeoutReturn {
  /** 実行中のタイマーをキャンセルして停止 */
  cancel: () => void;
  /** タイマーをキャンセルしてから新しく開始 */
  reset: () => void;
}

/**
 * React固有の問題を解決したsetTimeoutラッパー
 * コンポーネントのアンマウント時の自動クリーンアップ、クロージャーでの古い値参照問題、
 * 安定した関数参照によるパフォーマンス最適化を提供
 * @param callback - タイマー満了時に実行する関数
 * @param delay - 遅延時間（ミリ秒）、nullまたは負数でタイマー無効化
 * @returns タイマー制御用のcancelとresetメソッドを持つオブジェクト
 * @example
 * const { cancel, reset } = useTimeout(() => console.log('完了'), 1000);
 * // タイマーは自動開始され、必要に応じてキャンセルやリセット可能
 */
export const useTimeout = (callback: () => void, delay: number | null): UseTimeoutReturn => {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const callbackRef = useRef(callback);
  const delayRef = useRef(delay);

  // useEffectの依存配列でcallbackが変わるたび再実行されるため、
  // 最新の関数を保持してタイマー実行時の古い値参照を防ぐ
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // delayが動的に変更される場合でも最新値を参照するため
  useEffect(() => {
    delayRef.current = delay;
  }, [delay]);

  // 親コンポーネントの再レンダリング時にcancelの参照が変わらないよう固定
  // これにより子コンポーネントのuseEffectが不要に再実行されるのを防ぐ
  const cancel = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // 親コンポーネントの再レンダリング時にresetの参照が変わらないよう固定
  // また現在のdelay値を使って新しいタイマーを開始するため、refから取得
  const reset = useCallback(() => {
    cancel();
    const currentDelay = delayRef.current;
    if (currentDelay !== null && currentDelay >= 0) {
      timerRef.current = setTimeout(() => {
        callbackRef.current();
      }, currentDelay);
    }
  }, [cancel]);

  // delay値の変更時にタイマーを再設定し、コンポーネントアンマウント時に確実にクリーンアップ
  useEffect(() => {
    if (delay === null || delay < 0) {
      return;
    }

    const id = setTimeout(() => {
      callbackRef.current();
    }, delay);

    timerRef.current = id;

    // メモリリークとゴーストタイマーの実行を防ぐためクリーンアップ
    return () => {
      clearTimeout(id);
    };
  }, [delay]);

  return { cancel, reset };
};
