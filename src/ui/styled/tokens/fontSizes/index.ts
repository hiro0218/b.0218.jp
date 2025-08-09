import { clampFontSize, pxToRem } from '@/ui/lib/fonts';
import type { TokenValues } from '../types';
import { getFontSizeStep } from './utils';

export const fontSizesHeading: TokenValues<'fontSizes'> = {
  h1: { value: clampFontSize(getFontSizeStep(12), getFontSizeStep(10)) },
  h2: { value: clampFontSize(getFontSizeStep(10), getFontSizeStep(8)) },
  h3: { value: clampFontSize(getFontSizeStep(8), getFontSizeStep(6)) },
  h4: { value: clampFontSize(getFontSizeStep(6), getFontSizeStep(4)) },
  h5: { value: clampFontSize(getFontSizeStep(4), getFontSizeStep(3)) },
  h6: { value: clampFontSize(getFontSizeStep(3), getFontSizeStep(3)) },
};

const fontSizesValues: TokenValues<'fontSizes'> = {
  // heading
  ...fontSizesHeading,
  // size
  xs: { value: pxToRem(getFontSizeStep(1)) },
  sm: { value: pxToRem(getFontSizeStep(2)) },
  md: { value: pxToRem(getFontSizeStep(3)) },
  lg: { value: pxToRem(getFontSizeStep(4)) },
  // post content (-> semantic)
  'post-content': { value: clampFontSize(getFontSizeStep(4), getFontSizeStep(3)) },
};

export default fontSizesValues;
