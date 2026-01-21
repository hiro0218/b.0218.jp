import { Stack } from '@/components/UI/Layout';
import { styled } from '@/ui/styled';
import { truncateQuery } from './utils/createSearchMessage';

type SearchFooterProps = {
  searchQuery?: string;
};

/**
 * 検索パネルのフッター
 *
 * @description
 * キーボードショートカットの案内とGoogle検索へのリンクを表示します。
 */
export function SearchFooter({ searchQuery }: SearchFooterProps) {
  const query = searchQuery ? `site:b.0218.jp ${searchQuery}` : 'site:b.0218.jp';
  const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
  const displayQuery = searchQuery ? truncateQuery(searchQuery) : '';

  return (
    <Footer>
      <Stack direction="horizontal" gap={1} justify="space-between">
        <Stack align="center" direction="horizontal" gap={1} justify="space-between">
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
  padding: var(--spacing-1) var(--spacing-1);
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
    min-width: 20px;
    height: 20px;
    padding: var(--spacing-½);
    margin: 0 var(--spacing-½);
    font-size: var(--font-sizes-xs);
    background-color: var(--colors-gray-a-100);
    border-radius: var(--radii-4);
  }
`;
