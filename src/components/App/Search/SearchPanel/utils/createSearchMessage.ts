type SearchMessageOptions = {
  resultsCount: number;
  searchQuery: string;
};

const MAX_QUERY_DISPLAY_LENGTH = 20;

/**
 * 検索クエリを表示用に省略する
 * @param query - 検索クエリ
 * @returns 省略された検索クエリ
 */
export const truncateQuery = (query: string): string => {
  if (query.length <= MAX_QUERY_DISPLAY_LENGTH) {
    return query;
  }

  return `${query.slice(0, MAX_QUERY_DISPLAY_LENGTH)}...`;
};

export function createSearchStatusMessage({ resultsCount, searchQuery }: SearchMessageOptions): string {
  if (searchQuery) {
    const displayQuery = truncateQuery(searchQuery);
    return `${resultsCount}件の検索結果が見つかりました。「${displayQuery}」の検索結果です。`;
  }
  return `${resultsCount}件の検索結果が見つかりました。`;
}

export function createSearchResultMessage({ resultsCount, searchQuery }: SearchMessageOptions): string {
  if (searchQuery) {
    const displayQuery = truncateQuery(searchQuery);
    return `「${displayQuery}」の検索結果: ${resultsCount}件`;
  }
  return `検索結果: ${resultsCount}件`;
}
