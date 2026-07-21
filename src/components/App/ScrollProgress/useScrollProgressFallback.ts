import { type RefObject, useEffect } from 'react';
import throttle from '@/lib/utils/throttle';

/**
 * 対象要素が viewport 上端に到達してから、対象要素の下端が viewport 下端に到達するまでを
 * 0→1 として進捗を計算する（CSS `animation-range: contain` と同じ区間の定義）。
 * 対象要素が viewport に収まるほど短い場合は、常に 0 を返す（contain は本来この場合も
 * 区間を定義するが、この関数は簡略化している）。
 */
function calculateScrollProgress(target: HTMLElement): number {
  const rect = target.getBoundingClientRect();
  const scrollableHeight = rect.height - window.innerHeight;

  if (scrollableHeight <= 0) return 0;

  const ratio = -rect.top / scrollableHeight;

  return Math.max(0, Math.min(1, ratio));
}

export function useScrollProgressFallback(barRef: RefObject<HTMLDivElement | null>, targetAttr: string): void {
  useEffect(() => {
    // 判定条件は ScrollProgress/Bar.tsx の @supports 条件と文字列を一致させること
    if (CSS.supports('(view-timeline-name: --scroll-progress) and (animation-range: contain)')) return;

    const progressBar = barRef.current;
    const target = document.querySelector(`[${targetAttr}]`);

    if (!progressBar || !(target instanceof HTMLElement)) return;

    const updateProgress = () => {
      const progress = calculateScrollProgress(target);
      progressBar.style.transform = `scaleX(${progress})`;
    };

    updateProgress();

    const throttledUpdate = throttle(updateProgress);

    window.addEventListener('scroll', throttledUpdate, { passive: true });
    window.addEventListener('resize', throttledUpdate, { passive: true });

    return () => {
      window.removeEventListener('scroll', throttledUpdate);
      window.removeEventListener('resize', throttledUpdate);
    };
  }, [barRef, targetAttr]);
}
