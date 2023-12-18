import { clampFontSize, pxToRem } from '@/ui/lib/fonts';
import { css } from '@/ui/styled';

export default css`
  /**
   * Font Family
   */
  --font-family-sans-serif: 'Noto Sans JP', 'Noto Sans Japanese', 'Yu Gothic', 'Hiragino Kaku Gothic ProN',
    'Hiragino Sans', Meiryo, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif, 'Segoe UI Emoji';
  --font-family-monospace: SFMono-Regular, Consolas, Liberation Mono, Menlo, monospace, Apple Color Emoji,
    Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji;

  /**
   * Font Size
   */
  --font-size-xs: ${pxToRem(12)};
  --font-size-sm: ${pxToRem(14)};
  --font-size-md: ${pxToRem(16)};
  --font-size-lg: ${pxToRem(18)};

  /**
   * Heading Font Size
   */
  --font-size-h1: ${clampFontSize(36, 32)};
  --font-size-h2: ${clampFontSize(32, 28)};
  --font-size-h3: ${clampFontSize(28, 24)};
  --font-size-h4: ${clampFontSize(24, 20)};
  --font-size-h5: ${clampFontSize(20, 18)};
  --font-size-h6: ${clampFontSize(20, 16)};

  /**
   * Font Weight
   */
  --font-weight-normal: 400;
  --font-weight-bold: 700;
  --font-weight-bolder: 900;

  /**
   * Line Height
   */
  --line-height-sm: 1.4;
  --line-height-md: 1.6;
  --line-height-lg: 1.8;

  /**
   * Letter Spacing
   */
  --letter-spacing-sm: 0.02em;
  --letter-spacing-md: 0.04em;
`;
