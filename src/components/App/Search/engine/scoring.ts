/**
 * 検索結果のスコアリングとソートを担当するモジュール
 * @description
 * 検索結果の優先度を計算し、最適な順序で表示するためのロジックを提供する
 */

import type { MatchType } from '../types';

/**
 * 優先度スコア定数
 * @description
 * 各マッチタイプに割り当てる優先度スコア。
 * スコアが高いほど検索結果の上位に表示される。
 */
const EXACT_MATCH_SCORE = 100; // 完全一致（最優先）
const PARTIAL_MATCH_SCORE = 80; // 部分一致（スペースあり）
const EXACT_NO_SPACE_SCORE = 60; // スペース除去後の完全一致
const MULTI_TERM_MATCH_SCORE = 50; // 複数単語のAND条件一致
const PARTIAL_NO_SPACE_SCORE = 40; // スペース除去後の部分一致
const NO_MATCH_SCORE = 0; // 不一致

/**
 * Match type priority scores for search result ranking
 *
 * Higher scores appear first in results:
 * EXACT (100) > PARTIAL (80) > EXACT_NO_SPACE (60) > MULTI_TERM_MATCH (50) > PARTIAL_NO_SPACE (40) > NONE (0)
 */
const matchPriorityMap = new Map<MatchType, number>([
  ['EXACT', EXACT_MATCH_SCORE],
  ['PARTIAL', PARTIAL_MATCH_SCORE],
  ['EXACT_NO_SPACE', EXACT_NO_SPACE_SCORE],
  ['MULTI_TERM_MATCH', MULTI_TERM_MATCH_SCORE],
  ['PARTIAL_NO_SPACE', PARTIAL_NO_SPACE_SCORE],
  ['NONE', NO_MATCH_SCORE],
]);

/**
 * 検索結果の表示順序最適化のため、マッチタイプに応じた優先度スコアを返す
 * @param matchType - 判定されたマッチタイプ
 * @returns 優先度数値（高いほど優先表示、完全一致100〜不一致0）
 */
export const getMatchTypePriority = (matchType: MatchType): number => matchPriorityMap.get(matchType) ?? 0;
