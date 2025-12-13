import type { Metadata } from 'next';
import { getMetadata } from '@/app/_metadata';
import { Chart } from '@/components/Page/Archive/Chart';
import { Timeline } from '@/components/Page/Archive/Timeline';
import { Stack } from '@/components/UI/Layout';
import { Title } from '@/components/UI/Title';
import { SITE_URL } from '@/constants';
import { getPostsListJson } from '@/lib/data/posts';
import { getCollectionPageStructured } from '@/lib/domain/json-ld';
import { getData } from './_lib';

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

const renderTimelinesByYear = (archiveData: typeof archives) =>
  Object.keys(archiveData)
    .toReversed()
    .map((year) => <Timeline key={year} posts={archiveData[year]} year={year} />);

export default async function Page() {
  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            getCollectionPageStructured({
              name: pageTitle,
              description,
            }),
          ),
        }}
        type="application/ld+json"
      />
      <Stack as="article" space={4}>
        <Title heading={title} paragraph={description} />

        <Chart archives={archives} totalPosts={totalPosts} />

        {renderTimelinesByYear(archives)}
      </Stack>
    </>
  );
}
