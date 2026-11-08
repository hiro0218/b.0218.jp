import { styled } from '@/ui/styled';
import { SearchGoogleLink } from './SearchGoogleLink';
import { truncateQuery } from './truncateQuery';

interface SearchEmptyStateProps {
  searchQuery: string;
}

/**
 * @summary 検索語に一致する記事が 0 件のときの案内。次の手（Google 検索）を、結果の場所に出す。
 */
export function SearchEmptyState({ searchQuery }: SearchEmptyStateProps) {
  return (
    <Container>
      <Message>
        「<strong>{truncateQuery(searchQuery)}</strong>」に一致する記事はありません
      </Message>
      <SearchGoogleLink searchQuery={searchQuery} />
    </Container>
  );
}

// 上下の余白に --spacing-1000 を使わない。狭い画面でも 96px のままで、ダイアログが縦に長くなる
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-300);
  align-items: center;
  justify-content: center;
  width: 100%;
  max-height: var(--search-content-max-height);
  padding: var(--spacing-section) var(--spacing-100);
  overflow-y: auto;
  font-size: var(--font-sizes-sm);
  line-height: var(--grid-line-height-sm);
  text-align: center;
`;

const Message = styled.p`
  margin: 0;
  font-size: var(--font-sizes-md);
  line-height: var(--grid-line-height-body);
  color: var(--colors-gray-900);
  word-break: auto-phrase;
  text-wrap: pretty;
`;
