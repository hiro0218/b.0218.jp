import { css } from '@/ui/styled';

export default css`
  /**
   * Shadow
   */
  --shadow-base: color-mix(in oklab, var(--color-gray-3A), var(--color-gray-3A) 25%);
  --shadows-xs: 0px 1px 2px var(--shadow-base), 0px 0px 1px var(--color-gray-7A);
  --shadows-sm: 0px 2px 4px var(--shadow-base), 0px 0px 1px var(--color-gray-7A);
  --shadows-md: 0px 4px 8px var(--shadow-base), 0px 0px 1px var(--color-gray-7A);
  --shadows-lg: 0px 8px 16px var(--shadow-base), 0px 0px 1px var(--color-gray-7A);
  --shadows-xl: 0px 16px 24px var(--shadow-base), 0px 0px 1px var(--color-gray-7A);
  --shadows-2xl: 0px 24px 40px var(--shadow-base), 0px 0px 1px var(--color-gray-7A);
`;
