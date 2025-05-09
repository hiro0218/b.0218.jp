import type { Metadata } from 'next';
import { Chart } from '@/components/Page/Archive/Chart';
import {
  styleTimelineContainer,
  styleYearPostAnchor,
  YearHeader,
  YearHeaderPostCount,
  YearHeaderTitle,
  YearPostDate,
  YearPostSeparator,
  YearPosts,
} from '@/components/Page/Archive/Timeline';
import { Anchor } from '@/components/UI/Anchor';
import { Stack } from '@/components/UI/Layout';
import { Title } from '@/components/UI/Title';
import { SITE_URL } from '@/constant';
import { getCollectionPageStructured } from '@/lib/json-ld';
import { getPostsListJson } from '@/lib/posts';
import { convertPostSlugToPath } from '@/lib/url';
import type { PostListProps } from '@/types/source';
import { getMetadata } from '../_metadata';
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
            const yearArchives = archives[year];

            return (
              <div key={year} className={styleTimelineContainer}>
                <YearHeader>
                  <YearHeaderTitle id={`${year}年`}>{year}</YearHeaderTitle>
                  <span />
                  <YearHeaderPostCount>{yearArchives.length} posts</YearHeaderPostCount>
                </YearHeader>
                <YearPosts>
                  {yearArchives.map(({ slug, title, date }: PostListProps) => {
                    const link = convertPostSlugToPath(slug);
                    return (
                      <Anchor href={link} key={slug} className={styleYearPostAnchor}>
                        <YearPostDate>{date.replace(`${year}/`, '')}</YearPostDate>
                        <YearPostSeparator />
                        <span className="text-ellipsis">{title}</span>
                      </Anchor>
                    );
                  })}
                </YearPosts>
              </div>
            );
          })}
      </Stack>
    </>
  );
}
