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
 * 見出しフォントサイズの Atomic CSS クラスマップ（UI Heading コンポーネント用）
 *
 * UI Heading は本文 (`.post-content` 内の `h2-h6`) とは別系統の SectionTitle を表す。
 * ArticleCard / Hero / TagSection など、ページ内の小区画見出しに用いる。
 * セマンティックなタグ階層 (h1-h6) を保ちつつ、視覚サイズを意図的にダウンスケールして
 * カード内・セクション内で完結する見出し密度を作る。
 *
 * - h1, h2 → h4 サイズ（カード／セクションの主見出し）
 * - h3, h4, h5, h6 → h5 サイズ（カード／セクション内の副見出し）
 *
 * 本文 Heading の階層は `src/ui/styles/components/post-content/index.css` 側で
 * `font-sizes.h2`〜`h6` のフルスケールを使う。両者は別オブジェクトとして扱う。
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
