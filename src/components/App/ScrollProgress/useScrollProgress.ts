import { type RefObject, useEffect, useRef } from 'react';
import throttle from '@/lib/utils/throttle';

const MIN_PROGRESS = 0;
const MAX_PROGRESS = 100;

/**
 * 現在のスクロール位置から進捗率を計算する純粋関数
 * @returns 0-100の進捗率
 */
function calculateScrollProgress(): number {
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
 * スクロール進捗率を計算し、ref 経由で直接 DOM を更新するカスタムフック
 * React の再レンダーを発生させず、transform で GPU 合成のみで描画する
 */
export function useScrollProgress(): RefObject<HTMLDivElement | null> {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const updateProgress = () => {
      if (ref.current) {
        const progress = calculateScrollProgress();
        ref.current.style.transform = `scaleX(${progress / MAX_PROGRESS})`;
      }
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

  return ref;
}
