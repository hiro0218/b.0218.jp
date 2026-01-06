import { Stack } from '@/components/UI/Layout';
import { styled } from '@/ui/styled';
import { createSearchResultMessage, createSearchStatusMessage } from './libs/createSearchMessage';

type SearchStatusProps = {
  resultsCount: number;
  searchQuery: string;
};

export function SearchStatus({ resultsCount, searchQuery }: SearchStatusProps) {
  const statusMessage = createSearchStatusMessage({ resultsCount, searchQuery });

  return (
    <div aria-live="polite" className="sr-only">
      {statusMessage}
    </div>
  );
}

type SearchResultMessageProps = {
  resultsCount: number;
  searchQuery: string;
};

export function SearchResultMessage({ resultsCount, searchQuery }: SearchResultMessageProps) {
  const resultMessage = createSearchResultMessage({ resultsCount, searchQuery });

  return <Message>{resultMessage}</Message>;
}

type SearchExternalLinkProps = {
  searchQuery?: string;
};

export function SearchExternalLink({ searchQuery }: SearchExternalLinkProps) {
  const query = searchQuery ? `site:b.0218.jp ${searchQuery}` : 'site:b.0218.jp';
  const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;

  return (
    <SearchFooter>
      <Stack direction="horizontal" justify="space-between" space={1}>
        <Stack align="center" direction="horizontal" justify="space-between" space={1}>
          <span>
            <kbd>/</kbd>検索を開く
          </span>
          <span>
            <kbd>↑</kbd>
            <kbd>↓</kbd>選択
          </span>
          <span>
            <kbd>Enter</kbd>移動
          </span>
        </Stack>
        <Stack>
          <a href={searchUrl} rel="noreferrer" target="_blank">
            {searchQuery ? `Google で「${searchQuery}」を検索` : 'Google 検索'}
          </a>
        </Stack>
      </Stack>
    </SearchFooter>
  );
}

const Message = styled.div`
  padding: var(--spacing-½);
  font-size: var(--font-sizes-xs);
  font-weight: var(--font-weights-bold);
  line-height: var(--line-heights-xs);
  color: var(--colors-gray-900);
`;

const SearchFooter = styled.footer`
  padding: var(--spacing-1) var(--spacing-1);
  font-size: var(--font-sizes-xs);
  color: var(--colors-gray-900);
  text-align: right;
  background-color: var(--colors-gray-a-50);
  border-top: 1px solid var(--colors-gray-400);

  a {
    color: var(--colors-gray-900);
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  kbd {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 20px;
    height: 20px;
    padding: var(--spacing-½);
    margin: 0 var(--spacing-½);
    font-size: var(--font-sizes-xs);
    background-color: var(--colors-gray-a-100);
    border-radius: var(--radii-4);
  }
`;
