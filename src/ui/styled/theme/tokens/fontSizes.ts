import { clampFontSize, pxToRem } from '../../../lib/fonts';
import { getFontSizeStep } from './fontSizes/utils';
import type { TokenValues } from './types';

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
  // display を h1 と同じ大きさにしない。h2 との比 1.3 以上を保つため、h1 より 6px 大きい 36→40px にする
  display: { value: clampFontSize(getFontSizeStep(15), getFontSizeStep(13)) },
  // size
  xs: { value: pxToRem(getFontSizeStep(1)) },
  sm: { value: pxToRem(getFontSizeStep(2)) },
  md: { value: pxToRem(getFontSizeStep(3)) },
  lg: { value: pxToRem(getFontSizeStep(4)) },
  // post content (-> semantic)
  'post-content': { value: clampFontSize(getFontSizeStep(4), getFontSizeStep(3)) },
};

export default fontSizesValues;
