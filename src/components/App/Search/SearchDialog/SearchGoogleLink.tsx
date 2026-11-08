import { DOMAIN } from '@/constants';
import { css, cx } from '@/ui/styled';
import { stateLayer } from '@/ui/styled/components/stateLayerControl';
import { truncateQuery } from './truncateQuery';

// SITE_URL を解析し直してホスト名を取り出さない。SITE_URL は DOMAIN から作られた値で、DOMAIN をそのまま使える
const SITE_SEARCH_SCOPE = `site:${DOMAIN}`;

type SearchGoogleLinkProps = {
  searchQuery: string;
};

/**
 * @summary 検索語で、このサイトを対象にした Google 検索を開くリンク。検索語が空なら、サイト全体を対象にする。
 */
export function SearchGoogleLink({ searchQuery }: SearchGoogleLinkProps) {
  const query = searchQuery ? `${SITE_SEARCH_SCOPE} ${searchQuery}` : SITE_SEARCH_SCOPE;
  const label = searchQuery ? `Google で「${truncateQuery(searchQuery)}」を検索` : 'Google 検索';

  return (
    <a
      className={cx(stateLayer, linkStyle)}
      href={`https://www.google.com/search?q=${encodeURIComponent(query)}`}
      rel="noreferrer"
      target="_blank"
    >
      {label}
      <span className="sr-only">（外部サイト）</span>
    </a>
  );
}

// 外部リンクの矢印（ベース CSS が付ける ↗）に行の高さを持たせない。
// ベース CSS の inline-block だと、1 行ごとに 1.73px 高くなり、4px の格子から外れる
const linkStyle = css`
  display: inline-block;
  align-content: center;
  min-height: var(--tap-target);
  padding-inline: var(--spacing-75);
  color: var(--colors-gray-900);
  text-decoration: underline;
  text-decoration-thickness: var(--border-widths-thin);
  text-decoration-color: currentcolor;
  text-underline-offset: var(--spacing-75);
  border-radius: var(--radii-sm);

  &::after {
    margin-left: var(--spacing-75);
    line-height: 0;
  }
`;
