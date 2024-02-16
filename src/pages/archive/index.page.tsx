import Head from 'next/head';

import { Columns, Stack } from '@/components/UI/Layout';
import LinkCard from '@/components/UI/LinkCard';
import { Title } from '@/components/UI/Title';
import { SITE_NAME, SITE_URL } from '@/constant';
import { getPostsListJson } from '@/lib/posts';
import type { PostListProps } from '@/types/source';

import { divideByYearArchive } from './_libs';

const posts = getPostsListJson();
const archives = divideByYearArchive(posts);
const numberOfPosts = posts.length;

export default function Archive() {
  return (
    <>
      <Head>
        <title key="title">{`Archive - ${SITE_NAME}`}</title>
        <link href={`${SITE_URL}/archive`} rel="canonical" />
      </Head>

      <Stack as="article" space="4">
        <Title heading="Archive" paragraph={`${numberOfPosts}件の記事`} />

        {Object.keys(archives)
          .reverse()
          .map((year) => (
            <Columns key={year} title={`${year}年`}>
              <Stack space="½">
                {archives[year].map(({ slug, title, date, updated, tags }: PostListProps) => (
                  <LinkCard date={date} key={slug} link={`/${slug}.html`} tags={tags} title={title} updated={updated} />
                ))}
              </Stack>
            </Columns>
          ))}
      </Stack>
    </>
  );
}
