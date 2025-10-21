import type { Post } from '@/types/source';

export interface SearchProps extends Pick<Post, 'title' | 'tags' | 'slug'> {
  score?: number;
}

/**
 * 検索結果のマッチタイプ
 * @see src/components/UI/Search/utils/search.ts
 */
export type MatchType =
  | 'EXACT' // 完全一致（最優先）
  | 'PARTIAL' // 部分一致（スペースあり）
  | 'EXACT_NO_SPACE' // スペース除去後の完全一致
  | 'PARTIAL_NO_SPACE' // スペース除去後の部分一致
  | 'MULTI_TERM_MATCH' // 複数単語のAND条件一致
  | 'NONE'; // 不一致

/**
 * マッチした場所を示す型
 */
export type MatchedIn = 'title' | 'tag' | 'both';

/**
 * マッチタイプ情報を含む検索結果アイテム
 * SearchPropsを拡張し、どこにマッチしたか（タイトル/タグ）の情報を保持
 */
export interface SearchResultItem extends SearchProps {
  /** マッチのタイプ（完全一致、部分一致など） */
  matchType: MatchType;
  /** マッチした場所（タイトル、タグ、または両方） */
  matchedIn: MatchedIn;
}

export type OnCloseDialogProps = () => void;

export type SearchResultData = {
  keyword: string;
  suggestions: SearchResultItem[];
  focusedIndex: number;
};

export type KeyboardNavigationReturn = {
  isNavigationKey: (key: string) => boolean;
};
