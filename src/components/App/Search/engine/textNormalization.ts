/**
 * テキスト正規化エンジン
 * @description
 * 検索精度向上のため、テキストを小文字化・トリム・スペース除去する
 */

import type { MatchType } from '../types';

/**
 * 正規化されたテキスト
 * @property standard - 小文字化+トリム
 * @property compact - スペース除去版
 */
export type NormalizedText = {
  standard: string;
  compact: string;
};

/**
 * テキストを正規化
 * @param text - 正規化対象のテキスト
 * @returns 正規化されたテキスト（標準版とコンパクト版）
 */
export const normalizeText = (text: string): NormalizedText => {
  const standard = text.toLowerCase().trim();
  return {
    standard,
    compact: standard.replace(/\s+/g, ''),
  };
};

/**
 * 正規化されたテキストからマッチタイプを判定
 * @param textNorm - 正規化された検索対象テキスト
 * @param queryNorm - 正規化された検索クエリ
 * @returns マッチタイプ（MULTI_TERM_MATCH は返さない）
 * @note この関数は単一キーワード検索のマッチ判定のみを行うため、MULTI_TERM_MATCH は返却しません
 */
export const getMatchTypeFromNormalized = (textNorm: NormalizedText, queryNorm: NormalizedText): MatchType => {
  if (textNorm.standard === queryNorm.standard) return 'EXACT';
  if (textNorm.compact === queryNorm.compact) return 'EXACT_NO_SPACE';
  if (textNorm.standard.includes(queryNorm.standard)) return 'PARTIAL';
  if (textNorm.compact.includes(queryNorm.compact)) return 'PARTIAL_NO_SPACE';

  return 'NONE';
};
