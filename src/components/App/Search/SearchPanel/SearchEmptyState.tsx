import { styled } from '@/ui/styled';
import { truncateQuery } from './utils/createSearchMessage';

interface SearchEmptyStateProps {
  searchQuery: string;
}

/**
 * 検索の Empty State UI
 *
 * @description
 * 2つの状態を表示:
 * 1. 初期状態（searchQuery が空）: 検索を促すメッセージ
 * 2. 結果0件（searchQuery がある）: 結果なしメッセージと提案
 */
export function SearchEmptyState({ searchQuery }: SearchEmptyStateProps) {
  // 初期状態: 検索キーワード未入力
  if (!searchQuery) {
    return (
      <Container aria-live="polite" role="status">
        <Title>入力して記事を検索する</Title>
        <Description>タイトルや本文からキーワードで検索できます</Description>
      </Container>
    );
  }

  // 結果0件: 検索キーワードはあるが結果なし
  const displayQuery = truncateQuery(searchQuery);

  return (
    <Container aria-live="polite" role="status">
      <Title>検索結果が見つかりません</Title>
      <Query>「{displayQuery}」</Query>
      <Suggestion>検索条件を変えるなどして、もう一度お試しください。</Suggestion>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-height: 60vh;
  padding: var(--spacing-6) var(--spacing-1);
  overflow-y: auto;
  color: var(--colors-gray-600);
  text-align: center;

  @media (--isDesktop) {
    max-height: 50vh;
  }
`;

const Title = styled.h2`
  margin: 0;
  font-size: var(--font-sizes-lg);
  font-weight: var(--font-weights-semibold);
  line-height: var(--line-heights-lg);
  color: var(--colors-gray-900);
`;

const Description = styled.p`
  margin-top: var(--spacing-2);
  margin-bottom: 0;
  font-size: var(--font-sizes-sm);
  line-height: var(--line-heights-sm);
  color: var(--colors-gray-600);
`;

const Query = styled.p`
  margin-top: var(--spacing-2);
  margin-bottom: 0;
  font-size: var(--font-sizes-md);
  font-weight: var(--font-weights-bold);
  line-height: var(--line-heights-md);
  color: var(--colors-gray-800);
`;

const Suggestion = styled.p`
  padding-left: 0;
  margin-top: var(--spacing-4);
  margin-bottom: 0;
  font-size: var(--font-sizes-sm);
  line-height: var(--line-heights-md);
  color: var(--colors-gray-600);
`;
