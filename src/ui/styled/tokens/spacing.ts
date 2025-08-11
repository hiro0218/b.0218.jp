import { pxToRem } from '@/ui/lib/fonts';
import { SPACING_BASE_PX } from '@/ui/styled/constant';
import type { TokenValues } from './types';

const FIBONACCI = [1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 1597, 2584] as const;
const SPACING_SCALE = [0.5, ...FIBONACCI] as const;

export const Spaces = ['½', 1, 2, 3, 4, 5, 6] as const;
export const SPACE_KEYS = [
  '--spacing-½',
  '--spacing-1',
  '--spacing-2',
  '--spacing-3',
  '--spacing-4',
  '--spacing-5',
  '--spacing-6',
] as const;
export type SpaceGap = (typeof Spaces)[number];
type SpaceKey = (typeof SPACE_KEYS)[number];
type SpaceValue = `${number}rem`;

const SPACE_STEPS = Object.fromEntries(
  SPACE_KEYS.map((space, index) => {
    const radix = SPACING_SCALE[index];
    const value = pxToRem(SPACING_BASE_PX * radix);

    return [space, value];
  }),
) as Record<SpaceKey, SpaceValue>;

const spacingValues: TokenValues<'spacing'> = {
  '½': { value: SPACE_STEPS['--spacing-½'] },
  '1': { value: SPACE_STEPS['--spacing-1'] },
  '2': { value: SPACE_STEPS['--spacing-2'] },
  '3': { value: SPACE_STEPS['--spacing-3'] },
  '4': { value: SPACE_STEPS['--spacing-4'] },
  '5': { value: SPACE_STEPS['--spacing-5'] },
  '6': { value: SPACE_STEPS['--spacing-6'] },
};

export default spacingValues;
