import { clampFontSize, pxToRem } from '@/ui/lib/fonts';
import { SPACING_BASE_PX } from '@/ui/styled/constant';

export type FontSizeHeadingProps = `--font-size-h${1 | 2 | 3 | 4 | 5 | 6}`;

/**
 * 調和を生成する
 * 1.5, 1.75, 2, 2.25, 2.5, 2.75, 3...
 */
const getStep = (n: number): number => {
  if (n < 0) return 1;
  return 1.25 + Math.max(0, n) * 0.25;
};

/**
 * ステップに応じたフォントサイズを取得する
 */
const getFontSizeStep = (n: number): number => SPACING_BASE_PX * getStep(n);

/**
 * Heading Font Size
 */
export const fontSizeHeading: Record<FontSizeHeadingProps, string> = {
  '--font-size-h1': clampFontSize(getFontSizeStep(12), getFontSizeStep(10)),
  '--font-size-h2': clampFontSize(getFontSizeStep(10), getFontSizeStep(8)),
  '--font-size-h3': clampFontSize(getFontSizeStep(8), getFontSizeStep(6)),
  '--font-size-h4': clampFontSize(getFontSizeStep(6), getFontSizeStep(4)),
  '--font-size-h5': clampFontSize(getFontSizeStep(4), getFontSizeStep(3)),
  '--font-size-h6': clampFontSize(getFontSizeStep(3), getFontSizeStep(3)),
};

export const fontVariables = {
  /**
   * Font Size
   */
  '--font-size-xs': pxToRem(getFontSizeStep(1)),
  '--font-size-sm': pxToRem(getFontSizeStep(2)),
  '--font-size-md': pxToRem(getFontSizeStep(3)),
  '--font-size-lg': pxToRem(getFontSizeStep(4)),

  '--font-size-post-content': clampFontSize(getFontSizeStep(4), getFontSizeStep(3)),

  ...fontSizeHeading,

  /**
   * Line Height
   */
  '--line-height-xs': String(getStep(0)),
  '--line-height-sm': String(getStep(1)),
  '--line-height-md': String(getStep(2)),
  '--line-height-lg': String(getStep(3)),
} as const;
