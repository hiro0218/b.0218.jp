import type { Post } from '@/types/source';

export type SearchProps = Pick<Post, 'title' | 'tags' | 'slug'>;

/** 検索結果のマッチパターンの全値。型と実行時バリデーションの単一の真実源 */
export const MATCH_TYPE_VALUES = ['EXACT', 'PARTIAL', 'MULTI_TERM_MATCH', 'NONE'] as const;

/**
 * 検索結果のマッチパターン。
 * インデックス検索は MULTI_TERM_MATCH > EXACT > PARTIAL、タイトルフォールバック検索は常に PARTIAL を返す。
 * NONE は determineMatchType の網羅性のためにあり、実際の検索結果には現れない。
 */
export type MatchType = (typeof MATCH_TYPE_VALUES)[number];

/** 検索結果のマッチ箇所の全値。MATCH_TYPE_VALUES と同じく実行時バリデーションと型の単一の真実源 */
export const MATCHED_IN_VALUES = ['title', 'tag', 'both'] as const;

export type MatchedIn = (typeof MATCHED_IN_VALUES)[number];

export type SearchResultItem = SearchProps & {
  matchType: MatchType;
  matchedIn: MatchedIn;
};

export interface SearchState {
  results: SearchResultItem[];
  query: string;
}
