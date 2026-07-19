import { Stack } from '@/components/UI/Layout/Stack';
import { SITE_URL } from '@/constants';
import { styled } from '@/ui/styled';
import { truncateQuery } from './utils/createSearchMessage';

// Google の site: 検索スコープ。SITE_URL からホスト名を導出し、ドメイン変更時の直書き残留を防ぐ
const SITE_SEARCH_SCOPE = `site:${new URL(SITE_URL).host}`;

type SearchFooterProps = {
  searchQuery?: string;
};

/**
 * @summary キーボードショートカット案内と Google 検索リンクを表示するフッター。
 */
export function SearchFooter({ searchQuery }: SearchFooterProps) {
  const query = searchQuery ? `${SITE_SEARCH_SCOPE} ${searchQuery}` : SITE_SEARCH_SCOPE;
  const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
  const displayQuery = searchQuery ? truncateQuery(searchQuery) : '';

  return (
    <Footer>
      <Stack direction="horizontal" gap={100} justify="space-between">
        <Stack align="center" direction="horizontal" gap={100} justify="space-between">
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
            {displayQuery ? `Google で「${displayQuery}」を検索` : 'Google 検索'}
          </a>
        </Stack>
      </Stack>
    </Footer>
  );
}

const Footer = styled.footer`
  padding: var(--spacing-100) var(--spacing-100);
  font-size: var(--font-sizes-xs);
  color: var(--colors-gray-900);
  text-align: right;
  background-color: var(--colors-gray-a-50);

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
    min-width: var(--sizes-icon-sm);
    height: var(--sizes-icon-sm);
    padding: var(--spacing-75);
    margin: 0 var(--spacing-75);
    font-size: var(--font-sizes-xs);
    background-color: var(--colors-gray-a-100);
    border-radius: var(--radii-sm);
  }
`;
