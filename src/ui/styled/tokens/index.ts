import type { Theme } from '@pandacss/types';

import colors from './colors';
import easings from './easings';
import fontWeights from './fontWeights';
import lineHeights from './lineHeights';
import radii from './radii';
import zIndex from './zIndex';

export const tokens: Theme['tokens'] = {
  colors,
  easings,
  fontWeights,
  lineHeights,
  radii,
  zIndex,
};
