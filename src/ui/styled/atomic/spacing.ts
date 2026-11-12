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
  75: css`
    gap: var(--spacing-75);
  `,
  100: css`
    gap: var(--spacing-100);
  `,
  300: css`
    gap: var(--spacing-300);
  `,
  400: css`
    gap: var(--spacing-400);
  `,
  500: css`
    gap: var(--spacing-500);
  `,
  600: css`
    gap: var(--spacing-600);
  `,
  700: css`
    gap: var(--spacing-700);
  `,
  800: css`
    gap: var(--spacing-800);
  `,
  1000: css`
    gap: var(--spacing-1000);
  `,
} as const satisfies Record<SpaceGap | 0, string>;
