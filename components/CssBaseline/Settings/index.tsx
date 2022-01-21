import { css } from '@emotion/react';
import { gray } from '@radix-ui/colors';

import { getModularScale } from '@/lib/modular-scale';

const BaseFontSize = '1rem';

export default css`
  :root {
    /* color */
    /* 1:  アプリの背景 */
    --backgrounds-1: ${gray.gray1};
    /* 2:  微妙な背景 */
    --backgrounds-2: ${gray.gray2};
    /* 3:  UI要素の背景 */
    --component-backgrounds-3: ${gray.gray3};
    /* 4:  ホバーされたUI要素の背景 */
    --component-backgrounds-4: ${gray.gray4};
    /* 5:  アクティブ/選択されたUI要素の背景 */
    --component-backgrounds-5: ${gray.gray5};
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

    /* size */
    --container-width: 50rem;

    /* font */
    --font-family-sans-serif: 'Noto Sans JP', YuGoMedium, YuGothic, 'Yu Gothic', 'Hiragino Kaku Gothic ProN', Meiryo,
      -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    --font-family-monospace: ui-monospace, SFMono-Regular, Consolas, Liberation Mono, Menlo, Courier, monospace;

    --font-size-sm: ${getModularScale({ degree: -1 })};
    --font-size-md: ${getModularScale({ degree: 0 })};
    --font-size-lg: ${getModularScale({ degree: 1 })};

    /* margin */
    --margin-base: 1.5rem;

    /* space */
    --space-xx-sm: ${getModularScale({ baseFontSize: BaseFontSize, degree: -6 })};
    --space-x-sm: ${getModularScale({ baseFontSize: BaseFontSize, degree: -4 })};
    --space-sm: ${getModularScale({ baseFontSize: BaseFontSize, degree: -2 })};
    --space-md: ${getModularScale({ baseFontSize: BaseFontSize, degree: 0 })};
    --space-lg: ${getModularScale({ baseFontSize: BaseFontSize, degree: 2 })};
    --space-x-lg: ${getModularScale({ baseFontSize: BaseFontSize, degree: 4 })};
    --space-xx-lg: ${getModularScale({ baseFontSize: BaseFontSize, degree: 6 })};

    /* header */
    --header-height: 72px;

    /* z-index */
    --zIndex-header: 10;
    --zIndex-search: 12;
    --zIndex-search-overlay: 11;
  }
`;
