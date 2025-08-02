import { clampFontSize } from '@/ui/lib/fonts';
import { getFontSizeStep } from './utils';

export type FontSizeHeadingProps = `--font-size-h${1 | 2 | 3 | 4 | 5 | 6}`;

/**
 * 見出し要素のレスポンシブフォントサイズ定義
 */
export const fontSizeHeading: Record<FontSizeHeadingProps, string> = {
  '--font-size-h1': clampFontSize(getFontSizeStep(12), getFontSizeStep(10)),
  '--font-size-h2': clampFontSize(getFontSizeStep(10), getFontSizeStep(8)),
  '--font-size-h3': clampFontSize(getFontSizeStep(8), getFontSizeStep(6)),
  '--font-size-h4': clampFontSize(getFontSizeStep(6), getFontSizeStep(4)),
  '--font-size-h5': clampFontSize(getFontSizeStep(4), getFontSizeStep(3)),
  '--font-size-h6': clampFontSize(getFontSizeStep(3), getFontSizeStep(3)),
};
