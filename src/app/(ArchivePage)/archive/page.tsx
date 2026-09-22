import type { Metadata } from 'next';
import { getMetadata } from '@/app/_metadata';
import { StructuredData } from '@/components/Functional/StructuredData';
import { PostTimeline } from '@/components/Page/_shared/PostTimeline';
import { Chart } from '@/components/Page/Archive/Chart';
import { Heading } from '@/components/UI/Heading';
import { Stack } from '@/components/UI/Layout/Stack';
import { Title } from '@/components/UI/Title';
import { SITE_URL } from '@/constants';
import { getCollectionPageStructured } from '@/lib/domain/json-ld';
import { getDateAndUpdatedToSimpleFormat } from '@/lib/post/date';
import { getPostsListJson } from '@/lib/source/post';
import type { ArchivesByYear, PostSummary } from '@/types/source';

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

function ArchiveTimelinesByYear({ archives }: { archives: ArchivesByYear }) {
  return (
    <>
      {Object.keys(archives)
        .toReversed()
        .map((year) => (
          <Stack as="section" gap={300} key={year}>
            <Heading as="h2" id={`${year}年`} textSide={<span>{archives[year].length} posts</span>}>
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
