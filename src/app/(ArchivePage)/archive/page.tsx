import type { Metadata } from 'next';
import { Chart } from '@/components/Page/Archive/Chart';
import { Sidebar, Stack } from '@/components/UI/Layout';
import LinkCard from '@/components/UI/LinkCard';
import { Title } from '@/components/UI/Title';
import { SITE_URL } from '@/constant';
import { getCollectionPageStructured } from '@/lib/json-ld';
import { getPostsListJson } from '@/lib/posts';
import { convertPostSlugToPath } from '@/lib/url';
import type { PostListProps } from '@/types/source';
import { getMetadata } from '../_metadata';
import { divideByYearArchive } from './libs';

const posts = getPostsListJson();
const archives = divideByYearArchive(posts);
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
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            getCollectionPageStructured({
              name: pageTitle,
              description,
            }),
          ]),
        }}
        type="application/ld+json"
      />
      <Stack as="article" space={4}>
        <Title heading={title} paragraph={description} />

        <Chart archives={archives} totalPosts={totalPosts} />

        {Object.keys(archives)
          .reverse()
          .map((year) => {
            const currentYear = `${year}年`;
            return (
              <Sidebar key={year}>
                <Sidebar.Side>
                  <Sidebar.Title id={currentYear}>{currentYear}</Sidebar.Title>
                </Sidebar.Side>
                <Sidebar.Main>
                  <Stack>
                    {archives[year].map(({ slug, title, date, updated, tags }: PostListProps) => {
                      const link = convertPostSlugToPath(slug);
                      return (
                        <LinkCard date={date} key={slug} link={link} tags={tags} title={title} updated={updated} />
                      );
                    })}
                  </Stack>
                </Sidebar.Main>
              </Sidebar>
            );
          })}
      </Stack>
    </>
  );
}
