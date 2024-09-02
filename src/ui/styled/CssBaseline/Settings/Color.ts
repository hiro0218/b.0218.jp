import { blue, gray, grayA, grayDark, grayDarkA, purple, red, yellow } from '@radix-ui/colors';

import { css } from '@/ui/styled';

/**
 * @see https://www.radix-ui.com/colors/docs/palette-composition/understanding-the-scale
 */
export default css`
  --white: #fff;
  --black: #000;

  /**
   * Step 1-2: 背景
   */
  //  1: アプリの背景
  --backgrounds-1: ${gray.gray1};
  --backgrounds-1A: ${grayA.grayA1};
  --backgrounds-inverse-1: ${grayDark.gray1};
  --backgrounds-inverse-1A: ${grayDarkA.grayA1};

  //  2: 微妙な背景
  --backgrounds-2: ${gray.gray2};
  --backgrounds-2A: ${grayA.grayA2};
  --backgrounds-inverse-2: ${grayDark.gray2};
  --backgrounds-inverse-2A: ${grayDarkA.grayA2};

  /**
   * Step 3-5: コンポーネントの背景
   */
  //  3: UI要素の背景
  --component-backgrounds-3: ${gray.gray3};
  --component-backgrounds-3A: ${grayA.grayA3};
  --component-backgrounds-inverse-3: ${grayDark.gray3};
  --component-backgrounds-inverse-3A: ${grayDarkA.grayA3};

  //  4: ホバーされたUI要素の背景
  --component-backgrounds-4: ${gray.gray4};
  --component-backgrounds-4A: ${grayA.grayA4};
  --component-backgrounds-inverse-4: ${grayDark.gray4};
  --component-backgrounds-inverse-4A: ${grayDarkA.grayA4};

  //  5: アクティブ/選択されたUI要素の背景
  --component-backgrounds-5: ${gray.gray5};
  --component-backgrounds-5A: ${grayA.grayA5};
  --component-backgrounds-inverse-5: ${grayDark.gray5};
  --component-backgrounds-inverse-5A: ${grayDarkA.grayA5};

  /**
   * Step 6-8: 境界線
   */
  //  6: 微妙な境界線と区切り文字
  --borders-6: ${gray.gray6};
  --borders-inverse-6: ${grayDark.gray6};

  //  7: UI要素の境界線とフォーカスリング
  --borders-7: ${gray.gray7};
  --borders-inverse-7: ${grayDark.gray7};

  //  8: ホバーされたUI要素の境界線
  --borders-8: ${gray.gray8};
  --borders-inverse-8: ${grayDark.gray8};

  /**
   * Step 9-10: 無地の背景
   */
  //  9: しっかりとした背景
  --solid-backgrounds-9: ${gray.gray9};
  --solid-backgrounds-inverse-9: ${grayDark.gray9};

  // 10: ホバーされた無地の背景
  --solid-backgrounds-10: ${gray.gray10};
  --solid-backgrounds-inverse-10: ${grayDark.gray10};

  /**
   * Step 11-12: テキスト
   */
  // 11: 低コントラストのテキスト
  --text-11: ${gray.gray11};
  --text-inverse-11: ${grayDark.gray11};

  // 12: 高コントラストテキスト
  --text-12: ${gray.gray12};
  --text-inverse-12: ${grayDark.gray12};

  /**
   * その他
   */
  --overlay-backgrounds: ${grayA.grayA10};
  --body-background: ${gray.gray1};
  --background-accent-gradient-from: ${blue.blue4};
  --background-accent-gradient-to: ${red.red3};

  /**
   * Semantic Color
   */
  --dark-backgrounds: ${grayA.grayA12};
  --dark-foregrounds: ${gray.gray1};

  /**
   * Alert Color
   */
  --color-alert-note: ${blue.blue11};
  --color-alert-important: ${purple.purple11};
  --color-alert-warning: ${yellow.yellow11};
  --color-alert-caution: ${red.red11};

  /**
   * Shadow
   */
  --_shadow-base: 0 0 0 1px color-mix(in oklab, ${grayA.grayA3}, ${grayA.grayA3} 25%);
  --shadow-1: inset 0 0 0 1px ${grayA.grayA5}, inset 0 1.5px 2px 0 ${grayA.grayA2}, inset 0 1.5px 2px 0 ${grayA.grayA2};
  --shadow-2: var(--_shadow-base), 0 0 0 0.5px ${grayA.grayA1}, 0 1px 1px 0 ${grayA.grayA2},
    0 2px 1px -1px ${grayA.grayA1}, 0 1px 3px 0 ${grayA.grayA1};
  --shadow-3: var(--_shadow-base), 0 2px 3px -2px ${grayA.grayA3}, 0 3px 12px -4px ${grayA.grayA2},
    0 4px 16px -8px ${grayA.grayA2};
  --shadow-4: var(--_shadow-base), 0 8px 40px ${grayA.grayA2}, 0 12px 32px -16px ${grayA.grayA3};
`;
