import type { Theme } from '@pandacss/types';
import colors from './semanticTokens/colors';
import lineHeights from './semanticTokens/lineHeights';
import sizes from './semanticTokens/sizes';

export const semanticTokens: Theme['semanticTokens'] = {
  colors,
  lineHeights,
  sizes,
};
