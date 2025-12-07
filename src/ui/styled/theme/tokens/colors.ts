/**
 * Adobe Spectrum カラートークン定義
 *
 * @description
 * Adobe Spectrumのcolor-palette.jsonから数値ベースのカラースケール（25-1600）を抽出し、
 * Panda CSSのセマンティックトークンとして利用可能な形式に変換する。
 *
 * @see https://spectrum.adobe.com/page/color-system/
 * @see https://github.com/adobe/spectrum-tokens
 *
 * @example
 * // Panda CSSでの使用例
 * import { css } from "@/ui/styled";
 * const styles = css({
 *   backgroundColor: "colors.gray.100",  // 背景色
 *   borderColor: "colors.gray.300",      // 境界線
 *   color: "colors.gray.900",            // テキスト
 * });
 */
import colorPalette from '@adobe/spectrum-tokens/src/color-palette.json' with { type: 'json' };

/**
 * Adobe Spectrum color-palette.jsonの型定義
 *
 * @property sets.light.value - ライトテーマ用のカラー値（ソリッドカラー用）
 * @property sets.dark.value - ダークテーマ用のカラー値（ダークモード用）
 * @property value - テーマ非依存のカラー値（透明カラー用）
 */
interface ColorValue {
  sets?: {
    light?: { value: string };
    dark?: { value: string };
  };
  value?: string | number;
}

/**
 * Adobe Spectrum カラースケールの数値定義と用途
 *
 * @see https://spectrum.adobe.com/page/using-color/
 *
 * スケール値と推奨用途:
 * - 25-100: 背景（gray-100が基本背景色）
 * - 200-500: 境界線・無効状態（gray-300が標準ボーダー）
 * - 600-800: ホバー・強調表示
 * - 900-1600: テキスト・アイコン（gray-900以上で4.5:1のコントラスト比を確保）
 *
 * @note
 * 値が大きくなるほど背景とのコントラストが高くなる。
 * ライトテーマでは暗く、ダークテーマでは明るくなる。
 */
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
  white: ColorToken;
  black: ColorToken;

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

/**
 * ライトテーマ用のソリッドカラースケールを生成
 *
 * @description
 * color-palette.jsonから`{colorName}-{scaleNum}`キーで
 * `sets.light.value`を抽出してColorScaleオブジェクトを生成。
 *
 * @param colorName - color-palette.json内のカラー名（例: "blue", "gray"）
 * @param scales - スケール数値の配列（例: [100, 200, 300, ...]）
 * @returns ColorScale型のオブジェクト（例: { 100: { value: "#f5f5f5" }, ... }）
 *
 * @example
 * const blueScale = createSolidColorScale("blue", REGULAR_COLOR_SCALES);
 * // { 100: { value: "#e0f2fe" }, 200: { value: "#bae6fd" }, ... }
 */
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

/**
 * 透明カラースケールを生成（アルファチャンネル付き）
 *
 * @description
 * color-palette.jsonから`{prefix}-{scaleNum}`キーで
 * `value`プロパティ（rgba値）を抽出。オーバーレイ・シャドウに使用。
 *
 * @param spectrumPrefix - プレフィックス名（例: "transparent-black", "transparent-white"）
 * @returns 透明度付きカラースケール
 *
 * @example
 * const grayA = createTransparentColorScale("transparent-black");
 * // { 25: { value: "rgba(0,0,0,0.04)" }, 50: { value: "rgba(0,0,0,0.06)" }, ... }
 */
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

/**
 * ダークテーマ用のカラースケールを生成
 *
 * @description
 * color-palette.jsonから`sets.dark.value`を抽出。
 * ダークモード時の背景・テキストに使用。
 *
 * @param colorName - カラー名（通常は"gray"のみ使用）
 * @returns ダークテーマ用カラースケール
 */
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

/**
 * Adobe Spectrum カラートークンの完全な定義
 *
 * @description
 * Panda CSSの`theme.tokens.colors`で使用される全カラートークン。
 * ソリッドカラー・透明カラー・ダークテーマの3カテゴリを含む。
 *
 * @property blue, gray, green, etc. - ソリッドカラースケール
 * @property grass, sky, teal, accent - エイリアスカラー（既存カラーへのマッピング）
 * @property grayA, whiteA - 透明カラースケール（オーバーレイ用）
 * @property grayDark, grayDarkA - ダークテーマ用カラー
 */
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
  white: { value: colorPalette.white.value },
  black: { value: colorPalette.black.value },
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
