import colorPalette from '@adobe/spectrum-tokens/src/color-palette.json';

// Adobe Spectrum カラーパレットの型定義
interface ColorValue {
  sets?: {
    light?: { value: string };
    dark?: { value: string };
  };
  value?: string | number;
}

// Adobe Spectrum スケール定義
// Adobe Spectrum カラースケールの型定義
type RegularColorScale =
  | 100
  | 200
  | 300
  | 400
  | 500
  | 600
  | 700
  | 800
  | 900
  | 1000
  | 1100
  | 1200
  | 1300
  | 1400
  | 1500
  | 1600;

type GrayScale = 25 | 50 | 75 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 1000;

type TransparentScale = 25 | 50 | 75 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 1000;

/** Adobe Spectrum カラートークンの値 */
type ColorToken = { value: string };

/** カラースケール型（スケール番号をキーとする） */
type ColorScale<T extends number> = {
  [K in T]: ColorToken;
};

/** Adobe Spectrum カラートークン定義の型 */
type ColorTokens = {
  // ソリッドカラー
  blue: ColorScale<RegularColorScale>;
  gray: ColorScale<GrayScale>;
  green: ColorScale<RegularColorScale>;
  orange: ColorScale<RegularColorScale>;
  pink: ColorScale<RegularColorScale>;
  purple: ColorScale<RegularColorScale>;
  red: ColorScale<RegularColorScale>;
  yellow: ColorScale<RegularColorScale>;

  // 別名カラー
  grass: ColorScale<RegularColorScale>;
  sky: ColorScale<RegularColorScale>;
  teal: ColorScale<RegularColorScale>;
  accent: ColorScale<RegularColorScale>;

  // 透明カラー
  grayA: ColorScale<TransparentScale>;
  whiteA: ColorScale<TransparentScale>;

  // ダークテーマ
  grayDark: ColorScale<GrayScale>;
  grayDarkA: ColorScale<TransparentScale>;
};

const REGULAR_COLOR_SCALES = [
  100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600,
] as const;
const GRAY_SCALES = [25, 50, 75, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000] as const;
const TRANSPARENT_SCALES = [25, 50, 75, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000] as const;

// ソリッドカラースケール生成
function createSolidColorScale<T extends readonly number[]>(colorName: string, scales: T): ColorScale<T[number]> {
  const scale: Record<string, { value: string }> = {};

  for (const scaleNum of scales) {
    const key = `${colorName}-${scaleNum}`;
    const color = (colorPalette as unknown as Record<string, ColorValue>)[key];

    if (color?.sets?.light?.value) {
      scale[scaleNum] = { value: color.sets.light.value };
    }
  }

  return scale as ColorScale<T[number]>;
}

// 透明カラースケール生成
function createTransparentColorScale(spectrumPrefix: string): ColorScale<TransparentScale> {
  const scale: Record<string, { value: string }> = {};

  for (const scaleNum of TRANSPARENT_SCALES) {
    const key = `${spectrumPrefix}-${scaleNum}`;
    const color = (colorPalette as unknown as Record<string, ColorValue>)[key];

    if (color?.value && typeof color.value === 'string') {
      scale[scaleNum] = { value: color.value };
    }
  }

  return scale as ColorScale<TransparentScale>;
}

// ダークテーマカラースケール生成
function createDarkColorScale(colorName: string): ColorScale<GrayScale> {
  const scale: Record<string, { value: string }> = {};

  for (const scaleNum of GRAY_SCALES) {
    const key = `${colorName}-${scaleNum}`;
    const color = (colorPalette as unknown as Record<string, ColorValue>)[key];

    if (color?.sets?.dark?.value) {
      scale[scaleNum] = { value: color.sets.dark.value };
    }
  }

  return scale as ColorScale<GrayScale>;
}

// 全カラースケールを生成
const colorTokens: ColorTokens = {
  // ソリッドカラー
  blue: createSolidColorScale('blue', REGULAR_COLOR_SCALES),
  gray: createSolidColorScale('gray', GRAY_SCALES),
  green: createSolidColorScale('green', REGULAR_COLOR_SCALES),
  orange: createSolidColorScale('orange', REGULAR_COLOR_SCALES),
  pink: createSolidColorScale('pink', REGULAR_COLOR_SCALES),
  purple: createSolidColorScale('purple', REGULAR_COLOR_SCALES),
  red: createSolidColorScale('red', REGULAR_COLOR_SCALES),
  yellow: createSolidColorScale('yellow', REGULAR_COLOR_SCALES),

  // 別名カラー
  grass: createSolidColorScale('green', REGULAR_COLOR_SCALES),
  sky: createSolidColorScale('cyan', REGULAR_COLOR_SCALES),
  teal: createSolidColorScale('magenta', REGULAR_COLOR_SCALES),
  accent: createSolidColorScale('blue', REGULAR_COLOR_SCALES),

  // 透明カラー
  grayA: createTransparentColorScale('transparent-black'),
  whiteA: createTransparentColorScale('transparent-white'),

  // ダークテーマ
  grayDark: createDarkColorScale('gray'),
  grayDarkA: createTransparentColorScale('transparent-white'),
};

export default colorTokens;
