import { blue, blueA, gray, grayA, grayDark, grayDarkA, whiteA } from '@radix-ui/colors';

/**
 * @see https://www.radix-ui.com/colors/docs/palette-composition/understanding-the-scale
 */
const colorValues = {
  white: '#fff',
  black: '#000',

  /**
   * 1-2: 背景
   * 3-5: コンポーネントの背景
   * 6-8: 境界線
   * 9-10: 無地の背景
   * 11-12: テキスト
   */
  gray: {
    1: gray.gray1,
    2: gray.gray2,
    3: gray.gray3,
    4: gray.gray4,
    5: gray.gray5,
    6: gray.gray6,
    7: gray.gray7,
    8: gray.gray8,
    9: gray.gray9,
    10: gray.gray10,
    11: gray.gray11,
    12: gray.gray12,
  },

  /**
   * 透明度のあるグレースケール
   */
  grayA: {
    1: grayA.grayA1,
    2: grayA.grayA2,
    3: grayA.grayA3,
    4: grayA.grayA4,
    5: grayA.grayA5,
    6: grayA.grayA6,
    7: grayA.grayA7,
    10: grayA.grayA10,
    11: grayA.grayA11,
    12: grayA.grayA12,
  },

  /**
   * アクセントカラー
   */
  accent: {
    1: blue.blue1,
    2: blue.blue2,
    3: blue.blue3,
    4: blue.blue4,
    5: blue.blue5,
    6: blue.blue6,
    7: blue.blue7,
    8: blue.blue8,
    9: blue.blue9,
    10: blue.blue10,
    11: blue.blue11,
    12: blue.blue12,
  },

  /**
   * 透明度のあるアクセントカラー
   */
  accentA: {
    1: blueA.blueA1,
    2: blueA.blueA2,
    3: blueA.blueA3,
    4: blueA.blueA4,
    5: blueA.blueA5,
  },

  /**
   * ダークモード用グレースケール
   */
  grayInverse: {
    1: grayDark.gray1,
    2: grayDark.gray2,
    3: grayDark.gray3,
    4: grayDark.gray4,
    5: grayDark.gray5,
    6: grayDark.gray6,
    7: grayDark.gray7,
    8: grayDark.gray8,
    9: grayDark.gray9,
    10: grayDark.gray10,
    11: grayDark.gray11,
    12: grayDark.gray12,
  },

  /**
   * ダークモード用透明度のあるグレースケール
   */
  grayInverseA: {
    1: grayDarkA.grayA1,
    2: grayDarkA.grayA2,
    3: grayDarkA.grayA3,
    4: grayDarkA.grayA4,
    5: grayDarkA.grayA5,
  },

  /**
   * 透明度のある白
   */
  whiteA: {
    12: whiteA.whiteA12,
  },
};

// PandaCSS用のトークン定義
const colorTokens = {
  white: { value: colorValues.white },
  black: { value: colorValues.black },

  // Grays
  gray: Object.fromEntries(Object.entries(colorValues.gray).map(([key, value]) => [key, { value }])),

  // GrayAs
  grayA: Object.fromEntries(Object.entries(colorValues.grayA).map(([key, value]) => [key, { value }])),

  // Accent colors
  accent: Object.fromEntries(Object.entries(colorValues.accent).map(([key, value]) => [key, { value }])),

  // Accent alpha colors
  accentA: Object.fromEntries(Object.entries(colorValues.accentA).map(([key, value]) => [key, { value }])),

  // Gray inverse colors
  grayInverse: Object.fromEntries(Object.entries(colorValues.grayInverse).map(([key, value]) => [key, { value }])),

  // Gray inverse alpha colors
  grayInverseA: Object.fromEntries(Object.entries(colorValues.grayInverseA).map(([key, value]) => [key, { value }])),

  // White alpha colors
  whiteA: Object.fromEntries(Object.entries(colorValues.whiteA).map(([key, value]) => [key, { value }])),
};

export default colorTokens;
