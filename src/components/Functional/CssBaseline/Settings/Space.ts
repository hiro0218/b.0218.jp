import { css } from '@/ui/styled';

export const SPACING_BASE_PX = 8;

export default css`
  /**
   * space
   * 段階はフィボナッチ数列を利用
   */
  --space-½: ${SPACING_BASE_PX / 2}px;
  --space-1: ${SPACING_BASE_PX}px;
  --space-2: ${SPACING_BASE_PX * 2}px;
  --space-3: ${SPACING_BASE_PX * 3}px;
  --space-4: ${SPACING_BASE_PX * 5}px;
  --space-5: ${SPACING_BASE_PX * 8}px;
  --space-6: ${SPACING_BASE_PX * 13}px;
`;
