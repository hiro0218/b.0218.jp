'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect';

type RouteChangeCallback = () => void;

interface UseRouteChangeCompleteOptions {
  /** 初回レンダリング時のコールバック実行を回避 */
  skipInitial?: boolean;
}

/**
 * App Routerでのルート変更完了を監視してコールバックを実行
 * Pages Routerのrouterイベントが存在しないため、pathname/searchParamsを直接監視
 * @param callback - ルート変更完了時に実行する関数
 * @param options - 初回実行の制御設定
 * @example
 * ```typescript
 * // 基本的な使用方法
 * useRouteChangeComplete(() => {
 *   console.log('ルートが変更されました');
 * });
 *
 * // パフォーマンス最適化: callbackはuseCallbackでメモ化を推奨
 * const handleRouteChange = useCallback(() => {
 *   analytics.track('page_view');
 *   // フォーカス管理やスクリーンリーダー通知もここで実行可能
 * }, []);
 *
 * useRouteChangeComplete(handleRouteChange, { skipInitial: true });
 * ```
 */
export const useRouteChangeComplete = (
  callback: RouteChangeCallback,
  options?: UseRouteChangeCompleteOptions,
): void => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // URLの変更をオブジェクト参照ではなく値で比較するため文字列化
  const searchParamsString = searchParams?.toString() ?? '';

  // ルート変更の検知に必要な前回値の保持
  const previousPathnameRef = useRef(pathname);
  const previousSearchParamsRef = useRef(searchParamsString);
  const isFirstRenderRef = useRef(true);

  // 依存配列から除外してreactivity問題を回避するため値を固定
  const skipInitialRef = useRef(options?.skipInitial);

  // stale closure対策として最新のコールバック参照を保持
  const callbackRef = useRef(callback);

  // 同期的な更新でレンダリング中の一貫性を保証
  useIsomorphicLayoutEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    // 初回マウント時の予期しないコールバック実行を制御
    if (isFirstRenderRef.current) {
      isFirstRenderRef.current = false;
      if (skipInitialRef.current !== false) {
        return;
      }
    }

    // 値レベルの比較でルート変更を確実に検知
    const hasPathChanged = pathname !== previousPathnameRef.current;
    const hasSearchParamsChanged = searchParamsString !== previousSearchParamsRef.current;

    if (hasPathChanged || hasSearchParamsChanged) {
      // コールバックで予期しないエラーを防止
      try {
        callbackRef.current();
      } catch (error) {
        console.error('useRouteChangeComplete: Error in route change callback:', error);
      }
    }

    // 次回の変更検知のため現在値を記録
    previousPathnameRef.current = pathname;
    previousSearchParamsRef.current = searchParamsString;
  }, [pathname, searchParamsString]); // skipInitialRefの依存関係を排除してuseEffectの再実行を最小化
};
