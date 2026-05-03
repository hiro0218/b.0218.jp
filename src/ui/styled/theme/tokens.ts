import type { Theme } from '@pandacss/types';

import borderWidths from './tokens/borderWidths';
import colors from './tokens/colors';
import durations from './tokens/durations';
import easings from './tokens/easings';
import fontSizes from './tokens/fontSizes';
import fonts from './tokens/fonts';
import fontWeights from './tokens/fontWeights';
import letterSpacings from './tokens/letterSpacings';
import lineHeights from './tokens/lineHeights';
import radii from './tokens/radii';
import shadows from './tokens/shadows';
import spacing from './tokens/spacing';
import zIndex from './tokens/zIndex';

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
