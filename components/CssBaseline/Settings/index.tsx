import { css } from '@emotion/react';
import { gray } from '@radix-ui/colors';

import { getModularScale } from '@/lib/modular-scale';

export default css`
  :root {
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

    --background: #fff;
    --foreground: #000;

    --gray-0: #f8f8f8;
    --gray-1: #ececec;
    --gray-2: #d3d3d3;
    --gray-3: #c6c6c6;
    --gray-4: #959595;
    --gray-5: #888;
    --gray-6: #4a4a4a;
    --gray-7: #3e3e3e;
    --gray-8: #191919;
    --gray-9: #0c0c0c;

    /* color */
    --color-text--darker: var(--gray-9);
    --color-text--dark: var(--gray-8);
    --color-text: var(--gray-7);
    --color-text--light: var(--gray-6);
    --color-text--lighter: var(--gray-5);

    --color-text-heading: var(--gray-8);
    --color-text-description: var(--gray-5);
    --color-text-link: var(--gray-9);

    --bg-color--darker: var(--gray-4);
    --bg-color--dark: var(--gray-3);
    --bg-color: var(--gray-2);
    --bg-color--light: var(--gray-1);
    --bg-color--lighter: var(--gray-0);

    --mark-bg-color: var(--gray-1);

    /* size */
    --max-width: 640px;
    --desktop-width: 960px;
    --container-width: 85ch;

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
    --space-x-sm: ${getModularScale({ baseFontSize: '1.5rem', degree: -4 })};
    --space-sm: ${getModularScale({ baseFontSize: '1.5rem', degree: -2 })};
    --space-md: ${getModularScale({ baseFontSize: '1.5rem', degree: 0 })};
    --space-lg: ${getModularScale({ baseFontSize: '1.5rem', degree: 2 })};
    --space-x-lg: ${getModularScale({ baseFontSize: '1.5rem', degree: 4 })};

    /* header */
    --header-height: calc(var(--margin-base) * 3);

    /* z-index */
    --zIndex-header: 10;
    --zIndex-search: 12;
    --zIndex-search-overlay: 11;
  }
`;
