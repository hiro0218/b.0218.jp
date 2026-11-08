'use client';

import { useSyncExternalStore } from 'react';
import throttle from '@/lib/utils/throttle';
import { HEADER_HEIGHT_PX } from '@/ui/styled/constant';

const MIN_SCROLL_DELTA = 5;

// 表示状態をコンポーネントの state にしない。コンポーネントごとに持つと、スクロールの監視と直前のスクロール位置が二重になる。
// 片方だけずれて、ヘッダーは出ているのに「ページトップへ」(PageScroll) のボタンが隠れる、という食い違いが起こりうるため
let isHeaderVisible = true;
let previousScrollY = 0;
const listeners = new Set<() => void>();

const setHeaderVisible = (next: boolean) => {
  if (next === isHeaderVisible) return;

  isHeaderVisible = next;
  for (const listener of listeners) listener();
};

// scroll のたびには走らせず、throttle で間引く。毎回走らせると、スクロール中にパフォーマンスが劣化する
const handleScroll = throttle(() => {
  const currentScrollY = window.scrollY;
  const scrollDelta = currentScrollY - previousScrollY;

  if (Math.abs(scrollDelta) < MIN_SCROLL_DELTA) {
    return;
  }

  if (scrollDelta < 0) {
    setHeaderVisible(true);
  } else if (currentScrollY > HEADER_HEIGHT_PX) {
    setHeaderVisible(false);
  }

  previousScrollY = currentScrollY;
});

const subscribeHeaderVisibility = (onChange: () => void) => {
  listeners.add(onChange);

  if (listeners.size === 1) {
    isHeaderVisible = true;
    window.addEventListener('scroll', handleScroll, { passive: true });
    // scrollY を同期で読まず、1 フレーム待つ。スクロール位置の復元が済む前に読むと、復元後の位置と食い違う。
    requestAnimationFrame(() => {
      previousScrollY = window.scrollY;
      if (previousScrollY > HEADER_HEIGHT_PX) setHeaderVisible(false);
    });
  }

  return () => {
    listeners.delete(onChange);
    if (listeners.size === 0) window.removeEventListener('scroll', handleScroll);
  };
};

export const useHeaderVisibility = (): boolean =>
  useSyncExternalStore(
    subscribeHeaderVisibility,
    () => isHeaderVisible,
    () => true,
  );

const subscribeScroll = (onChange: () => void) => {
  window.addEventListener('scroll', onChange, { passive: true });
  return () => window.removeEventListener('scroll', onChange);
};

/** threshold の単位は px。サーバーでは常に false を返す。先頭付近だけで切り替えたい表示に使う */
export const useIsScrolledPast = (threshold: number): boolean =>
  useSyncExternalStore(
    subscribeScroll,
    () => window.scrollY > threshold,
    () => false,
  );
