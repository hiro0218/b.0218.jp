import type { Post } from '@/types/source';

export type SearchProps = Pick<Post, 'title' | 'tags' | 'slug'> & {
  score?: number;
};

/**
 * マッチタイプ
 *
 * @description
 * 検索結果のマッチパターンを表す型。
 * 優先度順: EXACT > PARTIAL > EXACT_NO_SPACE > MULTI_TERM_MATCH > PARTIAL_NO_SPACE > NONE
 */
export type MatchType = 'EXACT' | 'PARTIAL' | 'EXACT_NO_SPACE' | 'PARTIAL_NO_SPACE' | 'MULTI_TERM_MATCH' | 'NONE';

export type MatchedIn = 'title' | 'tag' | 'both';

export type SearchResultItem = SearchProps & {
  matchType: MatchType;
  matchedIn: MatchedIn;
};

export type RankedSearchResult = {
  post: SearchProps;
  priority: number;
  matchType: MatchType;
  matchedIn: MatchedIn;
};

export interface SearchState {
  results: SearchResultItem[];
  query: string;
  focusedIndex?: number;
}
