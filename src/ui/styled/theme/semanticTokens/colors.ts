/**
 * サイト全体の色役割（semantic color token）定義
 *
 * @description
 * パレット（tokens/colors.ts の Spectrum スケール）のうち、複数箇所を同じ判断で動かす値と
 * サイト全体の役割を表す値だけを役割名で公開する。
 * 追加・命名の判断基準は .claude/rules/design-principles.md を参照。
 */
const semanticColorTokens = {
  /** 反転面（Tooltip / Toast などの暗い面）の背景 */
  darkBackgrounds: { value: { base: '{colors.grayA.1000}' } },
  /** 反転面上のテキスト・アイコン */
  darkForegrounds: { value: { base: '{colors.gray.25}' } },
  /** ダイアログ・画像拡大などのオーバーレイ背景 */
  overlayBackgrounds: { value: { base: '{colors.grayA.500}' } },
  /** ページ全体の背景（背景色に合わせた切り抜き表現にも使う） */
  bodyBackground: { value: { base: '{colors.gray.50}' } },
  /** コピー成功状態のアイコン（CopyButton / Share） */
  copySuccessIcon: { value: { base: '{colors.grass.1200}' } },
  /** インタラクティブ要素の :focus-visible 表示 */
  focusRing: { value: { base: '{colors.accent.900}' } },
  /** テキスト選択（::selection）の背景 */
  selectionBackground: { value: { base: '{colors.grayA.300}' } },
};

export default semanticColorTokens;
