type SearchMessageOptions = {
  resultsCount: number;
  searchQuery: string;
};

const getNoResultMessage = (searchQuery: string): string => {
  return searchQuery
    ? `「${searchQuery}」に一致する記事は見つかりませんでした。`
    : '検索キーワードを入力してください。';
};

export function createSearchStatusMessage({ resultsCount, searchQuery }: SearchMessageOptions): string {
  if (resultsCount > 0) {
    return `${resultsCount}件の検索結果が見つかりました。${searchQuery ? `「${searchQuery}」の検索結果です。` : ''}`;
  }

  return getNoResultMessage(searchQuery);
}

export function createSearchResultMessage({ resultsCount, searchQuery }: SearchMessageOptions): string {
  if (resultsCount > 0) {
    return searchQuery ? `「${searchQuery}」の検索結果: ${resultsCount}件` : `検索結果: ${resultsCount}件`;
  }

  return getNoResultMessage(searchQuery);
}
