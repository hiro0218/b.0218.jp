import { pxToRem } from '@/ui/lib/fonts';
import { css } from '@/ui/styled';
import { SPACING_BASE_PX } from '@/ui/styled/CssBaseline/constant';

export type SpaceGap = '½' | 1 | 2 | 3 | 4 | 5 | 6;
type SpaceKey = `--space-${SpaceGap}`;
type SpaceValue = `${number}rem`;

export const SPACE_KEYS: SpaceKey[] = [
  '--space-½',
  '--space-1',
  '--space-2',
  '--space-3',
  '--space-4',
  '--space-5',
  '--space-6',
] as const;

/**
 * use fibonacci sequence
 */
const generateSpace = (n: number): number => {
  if (n === 1) return 1;
  if (n === 2) return 2;

  return generateSpace(n - 1) + generateSpace(n - 2);
};

/**
 * space
 * 4, 8, 16, 24, 40, 64, 104
 * @example { '--space-½': '0.25rem', '--space-1': '0.5rem', ... }
 */
export const SPACE_STEPS: Record<SpaceKey, SpaceValue> = Object.fromEntries(
  SPACE_KEYS.map((space, index) => {
    const radix = index === 0 ? 0.5 : generateSpace(index);
    const value = pxToRem(SPACING_BASE_PX * radix);
    return [space, value];
  }),
);

export default css`
  ${Object.entries(SPACE_STEPS).map(([key, value]: [SpaceKey, SpaceValue]) => `${key}: ${value};`)}
`;
