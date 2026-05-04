import { pxToRem } from '../../../lib/fonts';
import { SPACING_BASE_PX } from '../../constant';
import type { TokenValues } from './types';

const FIBONACCI = [1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 1597, 2584] as const;
const SPACING_SCALE = [0.5, ...FIBONACCI] as const;

export const Spaces = ['½', 1, 2, 3, 4, 5, 6] as const;
export type SpaceGap = (typeof Spaces)[number];

const spacingValues: TokenValues<'spacing'> = {} as TokenValues<'spacing'>;
Spaces.forEach((space, index) => {
  spacingValues[space] = { value: pxToRem(SPACING_BASE_PX * SPACING_SCALE[index]) };
});

export default spacingValues;
