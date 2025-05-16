/**
 * シングルページ設定の型定義
 */

/**
 * 単一ページのスラグ文字列のユニオン型
 */
export type PageSlug = 'about' | 'privacy';

/**
 * シングルページの設定情報の型
 */
export type SinglePageConfig = {
  slug: PageSlug;
  title: string;
  description: string;
};
