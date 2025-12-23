/**
 * Search 機能の公開API
 * @description
 * グローバル検索機能（ビジネスロジック + UI コンポーネント）を提供
 */

// UI コンポーネント
export { SearchButton } from './components/SearchButton';
export { SearchDialog } from './components/SearchDialog';

// 検索エンジン（ビジネスロジック）
export {
  findMatchingPosts,
  getTagMatchType,
  getTextMatchType,
  getTitleMatchType,
  isMultiTermMatching,
  isTextMatching,
} from './engine/matchingEngine';
export { getMatchTypePriority, MATCH_PRIORITY, sortAndLimitResults } from './engine/scoringEngine';
export { performPostSearch, useSearchWithCache } from './engine/searchEngine';
// フック（必要に応じて公開）
export { useSearchFacade } from './hooks/useSearchFacade';
// 型定義
export type { MatchedIn, MatchType, SearchProps, SearchResultItem, SearchState } from './types';
