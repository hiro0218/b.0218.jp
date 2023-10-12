import { blue, gray, grayA, purple, yellow } from '@radix-ui/colors';

import { css } from '@/ui/styled';

/**
 * @see https://www.radix-ui.com/docs/colors/palette-composition/understanding-the-scale
 */
export default css`
  /**
   * Step 1-2: 背景
   */
  //  1: アプリの背景
  --backgrounds-1: ${gray.gray1};
  --backgrounds-1A: ${grayA.grayA1};

  //  2: 微妙な背景
  --backgrounds-2: ${gray.gray2};
  --backgrounds-2A: ${grayA.grayA2};

  /**
   * Step 3-5: コンポーネントの背景
   */
  //  3: UI要素の背景
  --component-backgrounds-3: ${gray.gray3};
  --component-backgrounds-3A: ${grayA.grayA3};

  //  4: ホバーされたUI要素の背景
  --component-backgrounds-4: ${gray.gray4};
  --component-backgrounds-4A: ${grayA.grayA4};

  //  5: アクティブ/選択されたUI要素の背景
  --component-backgrounds-5: ${gray.gray5};
  --component-backgrounds-5A: ${grayA.grayA5};

  /**
   * Step 6-8: 境界線
   */
  //  6: 微妙な境界線と区切り文字
  --borders-6: ${gray.gray6};

  //  7: UI要素の境界線とフォーカスリング
  --borders-7: ${gray.gray7};

  //  8: ホバーされたUI要素の境界線
  --borders-8: ${gray.gray8};

  /**
   * Step 9-10: 無地の背景
   */
  //  9: しっかりとした背景
  --solid-backgrounds-9: ${gray.gray9};

  // 10: ホバーされた無地の背景
  --solid-backgrounds-10: ${gray.gray10};

  /**
   * Step 11-12: テキスト
   */
  // 11: 低コントラストのテキスト
  --text-11: ${gray.gray11};

  // 12: 高コントラストテキスト
  --text-12: ${gray.gray12};

  /**
   * その他
   */
  --overlay-backgrounds: ${grayA.grayA10};

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
`;
