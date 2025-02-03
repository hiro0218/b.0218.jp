import Head from 'next/head';

import { Sidebar, Stack } from '@/components/UI/Layout';
import LinkCard from '@/components/UI/LinkCard';
import { Title } from '@/components/UI/Title';
import { SITE_NAME, SITE_URL } from '@/constant';
import { getPostsListJson } from '@/lib/posts';
import type { PostListProps } from '@/types/source';

import { createGetLayout } from '../_layouts/ArchivePageLayout';
import { Chart } from './_components';
import { divideByYearArchive } from './_libs';

const posts = getPostsListJson();
const archives = divideByYearArchive(posts);
const totalPosts = posts.length;

export default function Archive() {
  return (
    <>
      <Head>
        <title key="title">{`Archive - ${SITE_NAME}`}</title>
        <link href={`${SITE_URL}/archive`} rel="canonical" />
      </Head>

      <Stack as="article" space={4}>
        <Title heading="Archive" paragraph={`${totalPosts}件の記事`} />

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
                  <Stack space={2}>
                    {archives[year].map(({ slug, title, date, updated, tags }: PostListProps) => (
                      <LinkCard
                        date={date}
                        key={slug}
                        link={`/${slug}.html`}
                        tags={tags}
                        title={title}
                        updated={updated}
                      />
                    ))}
                  </Stack>
                </Sidebar.Main>
              </Sidebar>
            );
          })}
      </Stack>
    </>
  );
}

Archive.getLayout = createGetLayout();
