import { useEffect } from 'react';
import throttle from '@/lib/utils/throttle';

function calculateScrollProgress(): number {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight;
  const windowHeight = window.innerHeight;

  if (docHeight <= windowHeight) return 0;

  const scrollableHeight = docHeight - windowHeight;
  const ratio = scrollTop / scrollableHeight;

  return Math.max(0, Math.min(1, ratio));
}

export function useScrollProgressFallback(targetId: string): void {
  useEffect(() => {
    if (CSS.supports('animation-timeline: scroll(root block)')) return;

    const progressBar = document.getElementById(targetId);

    if (!progressBar) return;

    const updateProgress = () => {
      const progress = calculateScrollProgress();
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
  }, [targetId]);
}
