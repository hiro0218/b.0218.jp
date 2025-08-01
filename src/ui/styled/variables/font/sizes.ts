import { clampFontSize, pxToRem } from '@/ui/lib/fonts';
import { getFontSizeStep, getStep } from './utils';

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

/**
 * 行間のCSS変数定義
 */
export const lineHeightVariables = {
  '--line-height-xs': String(getStep(0)),
  '--line-height-sm': String(getStep(1)),
  '--line-height-md': String(getStep(2)),
  '--line-height-lg': String(getStep(3)),
} as const;
