import { isDesktop, isMobile } from '@/ui/lib/mediaQuery';
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
  --font-size-sm: 14px;
  --font-size-md: 16px;
  --font-size-lg: 18px;

  /**
   * Heading Font Size
   */
  ${isDesktop} {
    --font-size-h1: 32px;
    --font-size-h2: 24px;
    --font-size-h3: 22px;
    --font-size-h4: 20px;
    --font-size-h5: 18px;
    --font-size-h6: 16px;
  }

  ${isMobile} {
    --font-size-h1: 24px;
    --font-size-h2: 22px;
    --font-size-h3: 20px;
    --font-size-h4: 18px;
    --font-size-h5: 16px;
    --font-size-h6: 16px;
  }

  /**
   * Font Weight
   */
  --font-weight-normal: 500;
  --font-weight-bold: 900;
`;
