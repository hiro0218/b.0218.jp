import type { Theme } from '@pandacss/types';

import borderWidths from './borderWidths';
import colors from './colors';
import durations from './durations';
import easings from './easings';
import fontSizes from './fontSizes';
import fonts from './fonts';
import fontWeights from './fontWeights';
import letterSpacings from './letterSpacings';
import lineHeights from './lineHeights';
import radii from './radii';
import shadows from './shadows';
import spacing from './spacing';
import zIndex from './zIndex';

export const tokens: Theme['tokens'] = {
  borderWidths,
  colors,
  durations,
  easings,
  fonts,
  fontSizes,
  fontWeights,
  letterSpacings,
  lineHeights,
  radii,
  shadows,
  spacing,
  zIndex,
};
