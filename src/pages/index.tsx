import dynamic from 'next/dynamic';
import Head from 'next/head';

import { Hero, PostSection, TitleSection } from '@/client/home';
import { SimpleGrid, Stack } from '@/components/UI/Layout';
import PostTag from '@/components/UI/Tag';
import { AUTHOR_ICON, SITE_URL } from '@/constant';
import { getOrganizationStructured } from '@/lib/json-ld';
import { getData } from '@/server/home';

const SrOnly = dynamic(() =>
  import('@/components/UI/ScreenReaderOnlyText').then((module) => module.ScreenReaderOnlyText),
);

const data = getData();

export default function Index() {
  const { recentPosts, updatesPosts, popularPosts, tags } = data;

  return (
    <>
      <Head>
        <meta content={AUTHOR_ICON} name="thumbnail" />
        <link href={SITE_URL} rel="canonical" />
        <script
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(getOrganizationStructured()),
          }}
          type="application/ld+json"
        ></script>
      </Head>

      <SrOnly as="h1" text="トップページ" />

      <Stack space="4">
        <Stack as="section">
          <Hero />
        </Stack>

        <Stack as="section">
          <TitleSection href="/archive" text="記事" />
          <Stack>
            <TitleSection as="h3" isBold={false} text="最新記事" />
            <PostSection posts={recentPosts} />
          </Stack>
          <Stack>
            <TitleSection as="h3" isBold={false} text="更新記事" />
            <PostSection posts={updatesPosts} />
          </Stack>
          <Stack>
            <TitleSection as="h3" href="/popular" isBold={false} text="注目記事" />
            <PostSection posts={popularPosts} />
          </Stack>
        </Stack>

        <Stack as="section">
          <TitleSection href="/tags" text="タグ" />
          <SimpleGrid>
            <PostTag tags={tags} />
          </SimpleGrid>
        </Stack>
      </Stack>
    </>
  );
}
