import { pxToRem } from '@/ui/lib/fonts';
import { SPACING_BASE_PX } from '@/ui/styled/constant';

const FIBONACCI = [1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 1597, 2584] as const;
const SPACING_SCALE = [0.5, ...FIBONACCI] as const;

export const Spaces = ['½', 1, 2, 3, 4, 5, 6] as const;
export const SPACE_KEYS = [
  '--space-½',
  '--space-1',
  '--space-2',
  '--space-3',
  '--space-4',
  '--space-5',
  '--space-6',
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

export const spaceVariables = {
  ...SPACE_STEPS,
} as const;
