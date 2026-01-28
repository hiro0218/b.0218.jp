import { useEffect, useState } from 'react';
import throttle from '@/lib/utils/throttle';

const MIN_PROGRESS = 0;
const MAX_PROGRESS = 100;

/**
 * 現在のスクロール位置から進捗率を計算する純粋関数
 * @returns 0-100の進捗率
 */
function calculateScrollProgress(): number {
  if (typeof window === 'undefined') return MIN_PROGRESS;

  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight;
  const windowHeight = window.innerHeight;

  // コンテンツがビューポート以下の場合は進捗表示しない
  if (docHeight <= windowHeight) return MIN_PROGRESS;

  const scrollableHeight = docHeight - windowHeight;
  const scrollPercentage = (scrollTop / scrollableHeight) * MAX_PROGRESS;

  // 0-100の範囲に制限
  return Math.max(MIN_PROGRESS, Math.min(MAX_PROGRESS, scrollPercentage));
}

/**
 * スクロール進捗率を計算して返すカスタムフック
 * @returns 0-100の進捗率
 */
export function useScrollProgress(): number {
  const [progress, setProgress] = useState(MIN_PROGRESS);

  useEffect(() => {
    const updateProgress = () => {
      setProgress(calculateScrollProgress());
    };

    updateProgress();

    const throttledUpdate = throttle(updateProgress);

    window.addEventListener('scroll', throttledUpdate, { passive: true });
    window.addEventListener('resize', throttledUpdate, { passive: true });

    return () => {
      window.removeEventListener('scroll', throttledUpdate);
      window.removeEventListener('resize', throttledUpdate);
    };
  }, []);

  return progress;
}
