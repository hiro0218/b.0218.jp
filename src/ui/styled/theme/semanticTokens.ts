import type { Theme } from '@pandacss/types';
import colors from './semanticTokens/colors';
import lineHeights from './semanticTokens/lineHeights';
import sizes from './semanticTokens/sizes';
import spacing from './semanticTokens/spacing';

export const semanticTokens: Theme['semanticTokens'] = {
  colors,
  lineHeights,
  sizes,
  spacing,
};
