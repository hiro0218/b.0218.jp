import { useEffect, useState } from 'react';

interface UseMotionPreferenceOptions {
  enabled: boolean;
  baseDuration: number;
}

/**
 * ユーザーのモーションプリファレンスを監視し、
 * prefers-reduced-motion に応じてアニメーション時間を調整する
 *
 * @param options - enabled: アニメーション有効化、baseDuration: 基本アニメーション時間
 * @returns 調整されたアニメーション時間
 */
export function useMotionPreference({ enabled, baseDuration }: UseMotionPreferenceOptions): number {
  const [duration, setDuration] = useState(baseDuration);

  useEffect(() => {
    if (!enabled) {
      setDuration(0);
      return;
    }

    const checkMotionPreference = () => {
      const prefersReducedMotion = window?.matchMedia('(prefers-reduced-motion: reduce)').matches;
      setDuration(prefersReducedMotion ? 0 : baseDuration);
    };

    checkMotionPreference();

    const mediaQuery = window?.matchMedia('(prefers-reduced-motion: reduce)');

    if (mediaQuery) {
      const handler = () => checkMotionPreference();
      mediaQuery.addEventListener('change', handler);

      return () => {
        mediaQuery.removeEventListener('change', handler);
      };
    }
  }, [enabled, baseDuration]);

  return duration;
}
