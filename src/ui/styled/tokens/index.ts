import type { Theme } from '@pandacss/types';

import colors from './colors';
import easings from './easings';
import fonts from './fonts';
import fontWeights from './fontWeights';
import letterSpacings from './letterSpacings';
import lineHeights from './lineHeights';
import radii from './radii';
import shadows from './shadows';
import zIndex from './zIndex';

export const tokens: Theme['tokens'] = {
  colors,
  easings,
  fonts,
  fontWeights,
  letterSpacings,
  lineHeights,
  radii,
  shadows,
  zIndex,
};
