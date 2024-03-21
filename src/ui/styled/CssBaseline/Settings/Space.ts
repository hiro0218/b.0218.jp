import { pxToRem } from '@/ui/lib/fonts';
import { css } from '@/ui/styled';

export const SPACING_BASE_PX = 8;

/**
 * use fibonacci sequence
 */
const generateSpace = (n: number): number => {
  if (n === 1) return 1;
  if (n === 2) return 2;

  return generateSpace(n - 1) + generateSpace(n - 2);
};

export default css`
  /**
   * space
   */
  --space-½: ${pxToRem(SPACING_BASE_PX * 0.5)}; // 4
  --space-1: ${pxToRem(SPACING_BASE_PX * generateSpace(1))}; // 8
  --space-2: ${pxToRem(SPACING_BASE_PX * generateSpace(2))}; // 16
  --space-3: ${pxToRem(SPACING_BASE_PX * generateSpace(3))}; // 24
  --space-4: ${pxToRem(SPACING_BASE_PX * generateSpace(4))}; // 40
  --space-5: ${pxToRem(SPACING_BASE_PX * generateSpace(5))}; // 64
  --space-6: ${pxToRem(SPACING_BASE_PX * generateSpace(6))}; // 104
`;
