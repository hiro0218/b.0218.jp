import { styled } from '@/ui/styled';
import { createSearchResultMessage } from './utils/createSearchMessage';

type SearchResultMessageProps = {
  resultsCount: number;
  searchQuery: string;
};

/**
 * @summary 検索結果の件数とキーワードを視覚的に表示するサマリー。
 */
export function SearchResultMessage({ resultsCount, searchQuery }: SearchResultMessageProps) {
  const resultMessage = createSearchResultMessage({ resultsCount, searchQuery });

  return <ResultsSummary>{resultMessage}</ResultsSummary>;
}

const ResultsSummary = styled.div`
  padding: var(--spacing-1) var(--spacing-1);
  font-size: var(--font-sizes-xs);
  line-height: var(--line-heights-xs);
  color: var(--colors-gray-600);
`;
