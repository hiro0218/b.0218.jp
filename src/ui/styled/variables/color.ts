import { blue, blueA, grass, gray, grayA, grayDark, grayDarkA, purple, red, whiteA, yellow } from '@radix-ui/colors';

/**
 * @see https://www.radix-ui.com/colors/docs/palette-composition/understanding-the-scale
 */
export const colorVariables = {
  '--white': '#fff',
  '--black': '#000',

  /**
   * Step 1-2: 背景
   */
  //  1: アプリの背景
  '--color-gray-1': gray.gray1,
  '--color-gray-1A': grayA.grayA1,
  '--color-accent-1': blue.blue1,
  '--color-accent-1A': blueA.blueA1,
  '--color-gray-inverse-1': grayDark.gray1,
  '--color-gray-inverse-1A': grayDarkA.grayA1,

  //  2: 微妙な背景
  '--color-gray-2': gray.gray2,
  '--color-gray-2A': grayA.grayA2,
  '--color-accent-2': blue.blue2,
  '--color-accent-2A': blueA.blueA2,
  '--color-gray-inverse-2': grayDark.gray2,
  '--color-gray-inverse-2A': grayDarkA.grayA2,

  /**
   * Step 3-5: コンポーネントの背景
   */
  //  3: UI要素の背景
  '--color-gray-3': gray.gray3,
  '--color-gray-3A': grayA.grayA3,
  '--color-accent-3': blue.blue3,
  '--color-accent-3A': blueA.blueA3,
  '--color-gray-inverse-3': grayDark.gray3,
  '--color-gray-inverse-3A': grayDarkA.grayA3,

  //  4: ホバーされたUI要素の背景
  '--color-gray-4': gray.gray4,
  '--color-gray-4A': grayA.grayA4,
  '--color-accent-4': blue.blue4,
  '--color-accent-4A': blueA.blueA4,
  '--color-gray-inverse-4': grayDark.gray4,
  '--color-gray-inverse-4A': grayDarkA.grayA4,

  //  5: アクティブ/選択されたUI要素の背景
  '--color-gray-5': gray.gray5,
  '--color-gray-5A': grayA.grayA5,
  '--color-accent-5': blue.blue5,
  '--color-accent-5A': blueA.blueA5,
  '--color-gray-inverse-5': grayDark.gray5,
  '--color-gray-inverse-5A': grayDarkA.grayA5,

  /**
   * Step 6-8: 境界線
   */
  //  6: 微妙な境界線と区切り文字
  '--color-gray-6': gray.gray6,
  '--color-gray-6A': grayA.grayA6,
  '--color-accent-6': blue.blue6,
  '--color-gray-inverse-6': grayDark.gray6,

  //  7: UI要素の境界線とフォーカスリング
  '--color-gray-7': gray.gray7,
  '--color-gray-7A': grayA.grayA7,
  '--color-accent-7': blue.blue7,
  '--color-gray-inverse-7': grayDark.gray7,

  //  8: ホバーされたUI要素の境界線
  '--color-gray-8': gray.gray8,
  '--color-accent-8': blue.blue8,
  '--color-gray-inverse-8': grayDark.gray8,

  /**
   * Step 9-10: 無地の背景
   */
  //  9: しっかりとした背景
  '--color-gray-9': gray.gray9,
  '--color-accent-9': blue.blue9,
  '--color-gray-inverse-9': grayDark.gray9,

  // 10: ホバーされた無地の背景
  '--color-gray-10': gray.gray10,
  '--color-accent-10': blue.blue10,
  '--color-gray-inverse-10': grayDark.gray10,

  /**
   * Step 11-12: テキスト
   */
  // 11: 低コントラストのテキスト
  '--color-gray-11': gray.gray11,
  '--color-gray-11A': grayA.grayA11,
  '--color-accent-11': blue.blue11,
  '--color-gray-inverse-11': grayDark.gray11,

  // 12: 高コントラストテキスト
  '--color-gray-12': gray.gray12,
  '--color-accent-12': blue.blue12,
  '--color-gray-inverse-12': grayDark.gray12,
  '--color-white-12A': whiteA.whiteA12,

  /**
   * Semantic Color
   */
  '--dark-backgrounds': grayA.grayA12,
  '--dark-foregrounds': gray.gray1,

  /**
   * Post Note
   */
  '--icon-post-note': grass.grass11,

  /**
   * Alert Color
   */
  '--color-alert-note': blue.blue11,
  '--color-alert-important': purple.purple11,
  '--color-alert-warning': yellow.yellow11,
  '--color-alert-caution': red.red11,

  /**
   * その他
   */
  '--overlay-backgrounds': grayA.grayA10,
  '--body-background': gray.gray1,
  '--background-accent-gradient-from': blue.blue4,
  '--background-accent-gradient-to': red.red3,
  '--table-shadow-color': grayA.grayA3,
  '--table-shadow-size': 'var(--space-1)',
  '--table-shadow-spread': 'calc(var(--table-shadow-size) * -0.5)',
} as const;
