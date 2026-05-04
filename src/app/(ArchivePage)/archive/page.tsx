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
import { getPostsListJson } from '@/lib/source/post';
import type { ArchivesByYear } from '@/types/source';
import { getData } from './_lib/getData';

const posts = getPostsListJson();
const archives = getData(posts);
const totalPosts = posts.length;
const slug = 'archive';
const title = 'Archive';
const pageTitle = '記事一覧';
const paragraph = `${totalPosts}件の記事`;
const description = `${pageTitle} - ${paragraph}`;

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
          <Stack as="section" gap={2} key={year}>
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
          name: pageTitle,
          description,
        })}
      />
      <Stack as="article" gap={4}>
        <Title paragraph={description}>{title}</Title>

        <Chart archives={archives} totalPosts={totalPosts} />

        <ArchiveTimelinesByYear archives={archives} />
      </Stack>
    </>
  );
}
