import { blackA, gray } from '@radix-ui/colors';

import { getModularScale } from '@/lib/modular-scale';
import { isDesktop, isMobile } from '@/ui/lib/mediaQuery';
import { css } from '@/ui/styled';

const SPACING_BASE_PX = 8;

export default css`
  /* stylelint-disable indentation */
  :root {
    /* color */
    /* 1:  アプリの背景 */
    --backgrounds-1: ${gray.gray1};
    --backgrounds-1A: ${blackA.blackA1};
    /* 2:  微妙な背景 */
    --backgrounds-2: ${gray.gray2};
    --backgrounds-2A: ${blackA.blackA2};
    /* 3:  UI要素の背景 */
    --component-backgrounds-3: ${gray.gray3};
    --component-backgrounds-3A: ${blackA.blackA3};
    /* 4:  ホバーされたUI要素の背景 */
    --component-backgrounds-4: ${gray.gray4};
    --component-backgrounds-4A: ${blackA.blackA4};
    /* 5:  アクティブ/選択されたUI要素の背景 */
    --component-backgrounds-5: ${gray.gray5};
    --component-backgrounds-5A: ${blackA.blackA5};
    /* 6:  微妙な境界線と区切り文字 */
    --borders-6: ${gray.gray6};
    /* 7:  UI要素の境界線とフォーカスリング */
    --borders-7: ${gray.gray7};
    /* 8:  ホバーされたUI要素の境界線 */
    --borders-8: ${gray.gray8};
    /* 9:  しっかりとした背景 */
    --solid-backgrounds-9: ${gray.gray9};
    /* 10: ホバーされた無地の背景 */
    --solid-backgrounds-10: ${gray.gray10};
    /* 11: 低コントラストのテキスト */
    --text-11: ${gray.gray11};
    /* 12: 高コントラストテキスト */
    --text-12: ${gray.gray12};

    --overlay-backgrounds: ${blackA.blackA10};

    /* size */
    --container-width: 50rem;

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
    --font-size-sm: ${getModularScale({ degree: -1 })};
    --font-size-md: ${getModularScale({ degree: 0 })};
    --font-size-lg: ${getModularScale({ degree: 1 })};

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

    /**
     * space
     * 段階はフィボナッチ数列を利用
     */
    --space-half: ${SPACING_BASE_PX / 2}px;
    --space-1: ${SPACING_BASE_PX}px;
    --space-2: ${SPACING_BASE_PX * 2}px;
    --space-3: ${SPACING_BASE_PX * 3}px;
    --space-4: ${SPACING_BASE_PX * 5}px;
    --space-5: ${SPACING_BASE_PX * 8}px;
    --space-6: ${SPACING_BASE_PX * 13}px;

    /**
     * border-radius
     */
    --border-radius-2: 2px;
    --border-radius-4: 4px;
    --border-radius-8: 8px;
    --border-radius-12: 12px;
    --border-radius-full: 100%;

    /* z-index */
    --zIndex-header: 10;
    --zIndex-search: 12;
  }
`;
