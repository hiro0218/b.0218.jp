import { useEffect, useState } from 'react';
import throttle from '@/lib/utils/throttle';

const MIN_PROGRESS = 0;
const MAX_PROGRESS = 100;

/**
 * スクロール進捗率を計算して返すカスタムフック
 * @returns 0-100の進捗率
 */
export function useScrollProgress(): number {
  const [progress, setProgress] = useState(() => {
    // Client Component なので window は常に存在するが、念のため
    if (typeof window === 'undefined') return MIN_PROGRESS;

    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight;
    const windowHeight = window.innerHeight;

    if (docHeight <= windowHeight) return MIN_PROGRESS;

    const scrollableHeight = docHeight - windowHeight;
    const scrollPercentage = (scrollTop / scrollableHeight) * MAX_PROGRESS;
    return Math.max(MIN_PROGRESS, Math.min(MAX_PROGRESS, scrollPercentage));
  });

  useEffect(() => {
    const calculateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight;
      const windowHeight = window.innerHeight;

      // コンテンツがビューポート以下の場合は進捗表示しない
      if (docHeight <= windowHeight) {
        setProgress(MIN_PROGRESS);
        return;
      }

      const scrollableHeight = docHeight - windowHeight;
      const scrollPercentage = (scrollTop / scrollableHeight) * MAX_PROGRESS;

      // 0-100の範囲に制限
      const clampedProgress = Math.max(MIN_PROGRESS, Math.min(MAX_PROGRESS, scrollPercentage));
      setProgress(clampedProgress);
    };

    // 初回計算
    calculateProgress();

    // throttle でパフォーマンス最適化
    const throttledCalculate = throttle(calculateProgress);

    // passive: true でスクロールパフォーマンス向上
    window.addEventListener('scroll', throttledCalculate, { passive: true });
    window.addEventListener('resize', throttledCalculate, { passive: true });

    return () => {
      window.removeEventListener('scroll', throttledCalculate);
      window.removeEventListener('resize', throttledCalculate);
    };
  }, []);

  return progress;
}
