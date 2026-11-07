import { CaretLineUpIcon } from '@phosphor-icons/react/ssr';
import type { Metadata } from 'next';
import { getMetadata } from '@/app/_metadata';
import { StructuredData } from '@/components/Functional/StructuredData';
import { PostTimeline } from '@/components/Page/_shared/PostTimeline';
import { Chart, YEAR_INDEX_ANCHOR_ID } from '@/components/Page/Archive/Chart';
import { Heading } from '@/components/UI/Heading';
import { IconButton } from '@/components/UI/IconButton';
import { Stack } from '@/components/UI/Layout/Stack';
import { Title } from '@/components/UI/Title';
import { SITE_URL } from '@/constants';
import { getCollectionPageStructured } from '@/lib/domain/json-ld';
import { getDateAndUpdatedToSimpleFormat } from '@/lib/post/date';
import { getPostsListJson } from '@/lib/source/post';
import type { ArchivesByYear, PostSummary } from '@/types/source';
import { ICON_SIZE_XS } from '@/ui/iconSizes';
import { css } from '@/ui/styled';

const getYear = (date: PostSummary['date']) => Number(date.slice(0, 4));

const groupPostsByYear = (posts: PostSummary[]): ArchivesByYear => {
  const transformedPosts = posts.map((post) => ({
    ...post,
    ...getDateAndUpdatedToSimpleFormat(post.date),
  }));

  return Object.groupBy(transformedPosts, (post) => String(getYear(post.date))) as ArchivesByYear;
};

// アーカイブは完全な記事索引として扱うため、宣伝用の棚 (getFilteredPosts) が行うタグ除外は適用しない。
// noindex (サンプル記事等、一覧から隠すべき投稿) だけを除く。
const posts = getPostsListJson().filter((post) => !post.noindex);
const archives = groupPostsByYear(posts);
const totalPosts = posts.length;
const slug = 'archive';
const title = '記事一覧';
const paragraph = `${totalPosts}件の記事`;
const description = `${title} - ${paragraph}`;

export const metadata: Metadata = getMetadata({
  title,
  description,
  url: `${SITE_URL}/${slug}`,
});

// 固定ヘッダーの高さ分だけジャンプ先をずらし、年別一覧からの着地後に見出しがヘッダーへ隠れないようにする。
// h2 は display: block でブロック幅いっぱいに広がるため、fit-content で外接矩形をテキスト幅に絞り、
// hash 遷移後の focus リングが入力欄のように見えるのを防ぐ。
const yearHeadingStyle = css`
  width: fit-content;
  scroll-margin-top: var(--spacing-800);
`;

function ArchiveTimelinesByYear({ archives }: { archives: ArchivesByYear }) {
  return (
    <>
      {Object.keys(archives)
        .toReversed()
        .map((year) => (
          <Stack as="section" gap={300} key={year}>
            <Heading
              as="h2"
              className={yearHeadingStyle}
              id={`${year}年`}
              tabIndex={-1}
              textSide={
                <Stack align="center" direction="horizontal" gap={100}>
                  <span>{archives[year].length} posts</span>
                  {/* 行き先の呼称に頼らず、方向だけで上部の年別チャートへ戻れることを示す。
                      グリフは PageScroll（ページトップへ）とそろえ、件数横の増減記号と誤読されるのを避ける。 */}
                  <IconButton
                    aria-label="年別アーカイブへ"
                    as="link"
                    href={`#${YEAR_INDEX_ANCHOR_ID}`}
                    size="touch"
                    tooltip="年別アーカイブへ"
                  >
                    <CaretLineUpIcon height={ICON_SIZE_XS} width={ICON_SIZE_XS} />
                  </IconButton>
                </Stack>
              }
            >
              {year}
            </Heading>
            <PostTimeline posts={archives[year]} />
          </Stack>
        ))}
    </>
  );
}

export default function Page() {
  return (
    <>
      <StructuredData
        data={getCollectionPageStructured({
          name: title,
          description,
        })}
      />
      <Stack as="article" gap={600}>
        <Title paragraph={paragraph}>{title}</Title>

        <Chart archives={archives} totalPosts={totalPosts} />

        <ArchiveTimelinesByYear archives={archives} />
      </Stack>
    </>
  );
}
