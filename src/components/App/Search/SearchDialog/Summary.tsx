import { styled } from '@/ui/styled';
import { truncateQuery } from './truncateQuery';

type SummaryProps = {
  /** 実行済みの検索語 */
  query: string;
  /** 結果の件数。エンジンの読み込みを待っている間は null */
  count: number | null;
};

/**
 * @summary 検索中と、検索結果の件数を知らせる一行。
 * 0 件のときは出さない。結果の場所に、一致する記事が無いことの案内（EmptyState）が出るため。
 * 読み上げは SearchDialog の status が担うので、aria-hidden にして二重に読ませない。
 */
export function Summary({ query, count }: SummaryProps) {
  if (count === 0) return null;

  const term = truncateQuery(query);

  return (
    <Root aria-hidden="true">
      {count === null ? `「${term}」を検索しています...` : `「${term}」の検索結果 ${count} 件`}
    </Root>
  );
}

// 左の余白は、行の文字の左端（一覧の余白 8px と行の余白 16px の合計）にそろえる
const Root = styled.p`
  padding: var(--spacing-100) var(--spacing-400) 0;
  margin: 0;
  font-size: var(--font-sizes-xs);
  line-height: var(--grid-line-height-sm);
  color: var(--colors-gray-700);
`;
