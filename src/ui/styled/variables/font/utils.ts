import { SPACING_BASE_PX } from '@/ui/styled/constant';

/**
 * 調和的なスケール値を計算 (1.25, 1.5, 1.75, 2.0, 2.25...)
 */
export const getStep = (n: number): number => {
  if (n < 0) return 1;
  return 1.25 + Math.max(0, n) * 0.25;
};

/**
 * ステップ値をピクセル単位のフォントサイズに変換
 */
export const getFontSizeStep = (n: number): number => SPACING_BASE_PX * getStep(n);
