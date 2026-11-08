'use client';

import { startTransition, useEffect, useState } from 'react';
import smoothScroll from '@/lib/browser/smoothScroll';

export const BrowserEffects = () => {
  // URL の更新直後にスクロールを始めない。ルーターの再描画の確定前だと、next-scroll-restorer の復元（layout effect）がスクロールを打ち切る。
  // setPendingScroll を startTransition の外で呼ばない。history.pushState が出すルーターの更新は startTransition の中にある。同じ lane に乗せると、1 回の描画で確定する。
  // setTimeout や requestAnimationFrame で数フレーム待たない。描画にかかる時間は端末と開発/本番で変わり、待ち切れない場合がある。
  const [pendingScroll, setPendingScroll] = useState<(() => void) | null>(null);

  useEffect(() => smoothScroll((scroll) => startTransition(() => setPendingScroll(() => scroll))), []);

  useEffect(() => {
    pendingScroll?.();
  }, [pendingScroll]);

  return null;
};
