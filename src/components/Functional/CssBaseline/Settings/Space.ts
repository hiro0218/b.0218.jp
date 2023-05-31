import { css } from '@/ui/styled';

export const SPACING_BASE_PX = 8;

export default css`
  /**
   * space
   * 段階はフィボナッチ数列を利用
   */
  --space-½: ${SPACING_BASE_PX / 2}px; // 4
  --space-1: ${SPACING_BASE_PX}px; // 8
  --space-2: ${SPACING_BASE_PX * 2}px; // 16
  --space-3: ${SPACING_BASE_PX * 3}px; // 24
  --space-4: ${SPACING_BASE_PX * 5}px; // 40
  --space-5: ${SPACING_BASE_PX * 8}px; // 64
  --space-6: ${SPACING_BASE_PX * 13}px; // 104
`;
