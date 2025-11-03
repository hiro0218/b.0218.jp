import type { Metadata } from 'next';
import { getMetadata } from '@/app/_metadata';
import { JsonLdScript } from '@/components/Functional/JsonLdScript';
import { Chart } from '@/components/Page/Archive/Chart';
import { Timeline } from '@/components/Page/Archive/Timeline';
import { Stack } from '@/components/UI/Layout';
import { Title } from '@/components/UI/Title';
import { SITE_URL } from '@/constant';
import { getPostsListJson } from '@/lib/data/posts';
import { getCollectionPageStructured } from '@/lib/domain/json-ld';
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

/**
 * 年度別タイムラインを新しい年から順に表示
 * reverse()による中間配列生成を避けるため、インデックスを使った逆順アクセスで直接要素を作成
 */
const renderTimelinesByYear = (archiveData: typeof archives) => {
  const years = Object.keys(archiveData);
  const timelines = [];

  // 新しい年から古い年へ逆順で処理
  for (let i = years.length - 1; i >= 0; i--) {
    const year = years[i];
    const yearArchives = archiveData[year];
    timelines.push(<Timeline key={year} posts={yearArchives} year={year} />);
  }

  return timelines;
};

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

        {renderTimelinesByYear(archives)}
      </Stack>
    </>
  );
}
