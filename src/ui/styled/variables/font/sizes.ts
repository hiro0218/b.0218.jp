import { clampFontSize, pxToRem } from '@/ui/lib/fonts';
import { getFontSizeStep } from './utils';

/**
 * 基本フォントサイズのCSS変数定義
 */
export const fontSizeVariables = {
  '--font-size-xs': pxToRem(getFontSizeStep(1)),
  '--font-size-sm': pxToRem(getFontSizeStep(2)),
  '--font-size-md': pxToRem(getFontSizeStep(3)),
  '--font-size-lg': pxToRem(getFontSizeStep(4)),
  '--font-size-post-content': clampFontSize(getFontSizeStep(4), getFontSizeStep(3)),
} as const;
