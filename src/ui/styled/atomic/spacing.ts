/**
 * Spacing Atomic CSS
 */

import { css } from '@/ui/styled';
import type { SpaceGap } from '@/ui/styled/theme/tokens/spacing';

/**
 * Gap Atomic CSS クラスマップ
 */
export const gapClasses = {
  0: css`
    gap: 0;
  `,
  '½': css`
    gap: var(--spacing-½);
  `,
  1: css`
    gap: var(--spacing-1);
  `,
  2: css`
    gap: var(--spacing-2);
  `,
  3: css`
    gap: var(--spacing-3);
  `,
  4: css`
    gap: var(--spacing-4);
  `,
  5: css`
    gap: var(--spacing-5);
  `,
  6: css`
    gap: var(--spacing-6);
  `,
} as const satisfies Record<SpaceGap | 0, string>;
