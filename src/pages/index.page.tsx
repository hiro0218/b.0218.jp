import dynamic from 'next/dynamic';
import Head from 'next/head';

import { SimpleGrid, Stack } from '@/components/UI/Layout';
import { AUTHOR_ICON, SITE_URL } from '@/constant';
import { getOrganizationStructured } from '@/lib/json-ld';
import { Hero, PostSection, TitleSection } from '@/pages/_components/home';
import { createGetLayout } from '@/pages/_layouts/TopPageLayout';

import { getData } from './_libs';

const PostTag = dynamic(() => import('@/components/UI/Tag').then((module) => module.default));

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

      <Stack space="5">
        <Stack as="section">
          <Hero />
        </Stack>

        <Stack as="section" space="4">
          <Stack>
            <TitleSection href="/archive" text="記事" />
            <TitleSection as="h3" isBold={false} text="最新記事" />
            <PostSection posts={recentPosts} />
          </Stack>
          <Stack>
            <TitleSection as="h3" href="/popular" isBold={false} text="注目記事" />
            <PostSection posts={popularPosts} />
          </Stack>
          <Stack>
            <TitleSection as="h3" isBold={false} text="更新記事" />
            <PostSection posts={updatesPosts} />
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

Index.getLayout = createGetLayout();
