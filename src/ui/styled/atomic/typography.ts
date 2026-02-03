/**
 * Typography Atomic CSS
 *
 * タイポグラフィに関連する再利用可能な型定義とAtomic CSSクラスを提供します。
 * Heading等のテキストコンポーネントで使用されます。
 */

import { css } from '@/ui/styled';

/**
 * Font weight の Atomic CSS クラスマップ
 *
 * フォントの太さのスタイルを提供します。
 * プロパティ値に応じて動的に適用されます（例: `fontWeightClasses[weight]`）。
 */
export const fontWeightClasses = {
  normal: css`
    font-weight: var(--font-weights-normal);
  `,
  bold: css`
    font-weight: var(--font-weights-bold);
  `,
} as const;

/**
 * フォントサイズ（h1〜h6）の Atomic CSS クラスマップ
 *
 * 各見出しレベルに対応するフォントサイズスタイルを提供します。
 * フォントサイズ変数に直接対応（例: `fontSizeHeadingClasses.h3` → `var(--font-sizes-h3)`）。
 */
export const fontSizeHeadingClasses = {
  h1: css`
    font-size: var(--font-sizes-h1);
  `,
  h2: css`
    font-size: var(--font-sizes-h2);
  `,
  h3: css`
    font-size: var(--font-sizes-h3);
  `,
  h4: css`
    font-size: var(--font-sizes-h4);
  `,
  h5: css`
    font-size: var(--font-sizes-h5);
  `,
  h6: css`
    font-size: var(--font-sizes-h6);
  `,
} as const;

/**
 * 見出しフォントサイズの Atomic CSS クラスマップ（Heading コンポーネント用）
 *
 * Heading コンポーネント専用のフォントサイズマッピングを提供します。
 * 見出しタグに応じて動的に適用されます（例: `headingFontSizeClasses[tag]`）。
 *
 * マッピング:
 * - h1, h2 → var(--font-sizes-h4)
 * - h3, h4, h5, h6 → var(--font-sizes-h5)
 */
export const headingFontSizeClasses = {
  h1: css`
    font-size: var(--font-sizes-h4);
  `,
  h2: css`
    font-size: var(--font-sizes-h4);
  `,
  h3: css`
    font-size: var(--font-sizes-h5);
  `,
  h4: css`
    font-size: var(--font-sizes-h5);
  `,
  h5: css`
    font-size: var(--font-sizes-h5);
  `,
  h6: css`
    font-size: var(--font-sizes-h5);
  `,
} as const;
