'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useEventListener } from '@/hooks/useEventListener';
import { isSSR } from '@/lib/isSSR';
import throttle from '@/lib/throttle';
import { SPACING_BASE_PX } from '@/ui/styled/constant';

const SCROLL_THRESHOLD = SPACING_BASE_PX * 8;
/** スクロールイベントの過剰な発火によるパフォーマンス劣化を防ぐため微小な変化を無視 */
const MIN_SCROLL_DELTA = 5;

/**
 * スクロール方向に基づいてヘッダーの表示状態を管理する
 *
 * スクロール時のパフォーマンス最適化のためスロットリング処理を実装し、微小なスクロール変化は無視してイベント発火頻度を制御する。
 * 下方向スクロール時は画面領域を最大化するためヘッダーを非表示にし、上方向スクロール時はナビゲーション改善のためヘッダーを表示する。
 *
 * @returns ヘッダーの表示状態（true: 表示、false: 非表示）
 */
export const useHeaderScrollHandler = (): boolean => {
  const [isHeaderVisible, setIsHeaderVisible] = useState<boolean>(true);
  const previousScrollY = useRef<number>(0);
  const isFirstRender = useRef<boolean>(true);

  useEffect(() => {
    // クライアントサイドでは初期スクロール位置を設定
    if (!isSSR && isFirstRender.current) {
      previousScrollY.current = window.scrollY;
      // 初期位置が閾値を超えている場合はヘッダーを非表示
      if (window.scrollY > SCROLL_THRESHOLD) {
        setIsHeaderVisible(false);
      }
      isFirstRender.current = false;
    }
  }, []);

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    const scrollDelta = currentScrollY - previousScrollY.current;

    // スクロールイベントの過剰な発火によるパフォーマンス劣化を防ぐため微小な変化を無視
    if (Math.abs(scrollDelta) < MIN_SCROLL_DELTA) {
      return;
    }

    if (scrollDelta < 0) {
      // ナビゲーション改善のため上方向スクロール時はヘッダー表示
      setIsHeaderVisible(true);
    } else if (scrollDelta > 0 && currentScrollY > SCROLL_THRESHOLD) {
      // 画面領域最大化のため下方向スクロールかつ閾値超過時はヘッダー非表示
      setIsHeaderVisible(false);
    }

    previousScrollY.current = currentScrollY;
  }, []);

  // パフォーマンス劣化を防ぐためスロットリング処理
  // biome-ignore lint/correctness/useExhaustiveDependencies: 依存配列は空で固定
  const throttledHandleScroll = useMemo(() => throttle(handleScroll), []);

  useEventListener('scroll', throttledHandleScroll, { passive: true });

  return isHeaderVisible;
};
