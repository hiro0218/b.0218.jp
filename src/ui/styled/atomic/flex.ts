/**
 * Flexbox Atomic CSS
 *
 * Flexboxレイアウトに関連する再利用可能な型定義とAtomic CSSクラスを提供します。
 * Stack等のレイアウトコンポーネントで使用されます。
 */

import type { CSSProperties } from 'react';
import { css } from '@/ui/styled';

/**
 * Flexbox align-items プロパティの型定義
 *
 * Flexboxコンテナ内のアイテムの交差軸方向の配置を指定します。
 * レイアウトコンポーネントのプロパティ型として使用されます。
 */
export type FlexAlign = Extract<
  CSSProperties['alignItems'],
  'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline'
>;

/**
 * Flexbox justify-content プロパティの型定義
 *
 * Flexboxコンテナ内のアイテムの主軸方向の配置を指定します。
 * レイアウトコンポーネントのプロパティ型として使用されます。
 */
export type FlexJustify = Extract<
  CSSProperties['justifyContent'],
  'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly'
>;

/**
 * Flexbox flex-wrap プロパティの型定義
 *
 * Flexboxコンテナ内のアイテムの折り返し方法を指定します。
 * レイアウトコンポーネントのプロパティ型として使用されます。
 */
export type FlexWrap = Extract<CSSProperties['flexWrap'], 'nowrap' | 'wrap' | 'wrap-reverse'>;

/**
 * Flexbox基本スタイル（display: flex）
 *
 * 全てのFlexboxコンテナに適用される基本スタイルです。
 * min-width: 0 により、Flexアイテムのデフォルトの min-width: auto をリセットし、
 * テキストや画像などのコンテンツが親要素の幅を超えてはみ出さないようにします。
 */
export const flexBaseStyle = css`
  display: flex;
  min-width: 0;
`;

/**
 * Flexbox align-items の Atomic CSS クラスマップ
 *
 * 交差軸方向のアイテム配置スタイルを提供します。
 * プロパティ値に応じて動的に適用されます（例: `alignClasses[align]`）。
 */
export const alignClasses = {
  'flex-start': css`
    align-items: flex-start;
  `,
  center: css`
    align-items: center;
  `,
  'flex-end': css`
    align-items: flex-end;
  `,
  stretch: css`
    align-items: stretch;
  `,
  baseline: css`
    align-items: baseline;
  `,
} as const;

/**
 * Flexbox justify-content の Atomic CSS クラスマップ
 *
 * 主軸方向のアイテム配置スタイルを提供します。
 * プロパティ値に応じて動的に適用されます（例: `justifyClasses[justify]`）。
 */
export const justifyClasses = {
  'flex-start': css`
    justify-content: flex-start;
  `,
  center: css`
    justify-content: center;
  `,
  'flex-end': css`
    justify-content: flex-end;
  `,
  'space-between': css`
    justify-content: space-between;
  `,
  'space-around': css`
    justify-content: space-around;
  `,
  'space-evenly': css`
    justify-content: space-evenly;
  `,
} as const;

/**
 * Flexbox flex-wrap の Atomic CSS クラスマップ
 *
 * アイテムの折り返し方法のスタイルを提供します。
 * プロパティ値に応じて動的に適用されます（例: `wrapClasses[wrap]`）。
 */
export const wrapClasses = {
  nowrap: css`
    flex-wrap: nowrap;
  `,
  wrap: css`
    flex-wrap: wrap;
  `,
  'wrap-reverse': css`
    flex-wrap: wrap-reverse;
  `,
} as const;

/**
 * Flexbox flex-direction の Atomic CSS クラスマップ
 *
 * 主軸の方向を指定するスタイルを提供します。
 * プロパティ値に応じて動的に適用されます（例: `directionClasses[direction]`）。
 */
export const directionClasses = {
  horizontal: css`
    flex-direction: row;
  `,
  vertical: css`
    flex-direction: column;
  `,
} as const;
