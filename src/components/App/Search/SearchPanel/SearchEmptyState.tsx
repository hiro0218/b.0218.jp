import { styled } from '@/ui/styled';
import { truncateQuery } from './utils/createSearchMessage';

interface SearchEmptyStateProps {
  searchQuery: string;
}

/**
 * @summary 検索結果なし状態の UI。未入力と 0 件の 2 状態を切り替える。
 */
export function SearchEmptyState({ searchQuery }: SearchEmptyStateProps) {
  if (!searchQuery) {
    return (
      <Container>
        <Title>入力して記事を検索する</Title>
        <Description>タイトルやタグからキーワードで検索できます</Description>
      </Container>
    );
  }

  const displayQuery = truncateQuery(searchQuery);

  return (
    <Container>
      <Title>検索結果が見つかりません</Title>
      <Query>「{displayQuery}」</Query>
      <Suggestion>検索条件を変えるなどして、もう一度お試しください。</Suggestion>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-300);
  align-items: center;
  justify-content: center;
  width: 100%;
  max-height: var(--search-content-max-height);
  padding: var(--spacing-1000) var(--spacing-100);
  overflow-y: auto;
  color: var(--colors-gray-600);
  text-align: center;
`;

const Title = styled.h2`
  margin: 0;
  font-size: var(--font-sizes-lg);
  font-weight: var(--font-weights-semibold);
  line-height: var(--line-heights-lg);
  color: var(--colors-gray-900);
`;

const Description = styled.p`
  margin: 0;
  font-size: var(--font-sizes-sm);
  line-height: var(--line-heights-sm);
  color: var(--colors-gray-600);
`;

const Query = styled.p`
  margin: 0;
  font-size: var(--font-sizes-md);
  font-weight: var(--font-weights-bold);
  line-height: var(--line-heights-md);
  color: var(--colors-gray-800);
`;

const Suggestion = styled.p`
  padding-left: 0;
  margin-top: var(--spacing-300);
  margin-bottom: 0;
  font-size: var(--font-sizes-sm);
  line-height: var(--line-heights-md);
  color: var(--colors-gray-600);
`;
