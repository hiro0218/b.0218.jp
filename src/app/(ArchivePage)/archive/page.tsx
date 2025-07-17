import type { Metadata } from 'next';
import { getMetadata } from '@/app/_metadata';
import { JsonLdScript } from '@/components/Functional/JsonLdScript';
import { Chart } from '@/components/Page/Archive/Chart';
import { Timeline } from '@/components/Page/Archive/Timeline';
import { Stack } from '@/components/UI/Layout';
import { Title } from '@/components/UI/Title';
import { SITE_URL } from '@/constant';
import { getCollectionPageStructured } from '@/lib/json-ld';
import { getPostsListJson } from '@/lib/posts';
import { getData } from './libs';

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

export default async function Page() {
  return (
    <>
      <JsonLdScript
        jsonLd={getCollectionPageStructured({
          name: pageTitle,
          description,
        })}
      />
      <Stack as="article" space={4}>
        <Title heading={title} paragraph={description} />

        <Chart archives={archives} totalPosts={totalPosts} />

        {Object.keys(archives)
          .reverse()
          .map((year) => {
            const yearArchives = archives[year];

            return <Timeline key={year} posts={yearArchives} year={year} />;
          })}
      </Stack>
    </>
  );
}
