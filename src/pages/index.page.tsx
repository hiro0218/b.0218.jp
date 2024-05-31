import dynamic from 'next/dynamic';
import Head from 'next/head';

import { PostSection } from '@/components/Feature/PostSection';
import { TagSection } from '@/components/Feature/TagSection';
import Heading from '@/components/UI/Heading';
import { Stack } from '@/components/UI/Layout';
import { AUTHOR_ICON, SITE_URL } from '@/constant';
import { getOrganizationStructured } from '@/lib/json-ld';
import { Hero } from '@/pages/_components/home';
import { createGetLayout } from '@/pages/_layouts/TopPageLayout';

import { getData } from './_libs';

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

      <Stack space={5}>
        <Stack as="section">
          <Hero />
        </Stack>

        <Stack space={4}>
          <Stack as="section">
            <Heading as="h2" text="記事" />
            <PostSection
              heading="最新記事"
              headingLevel="h3"
              headingWeight="normal"
              href="/archive"
              posts={recentPosts}
            />
          </Stack>
          <Stack as="section">
            <PostSection
              heading="注目記事"
              headingLevel="h3"
              headingWeight="normal"
              href="/popular"
              posts={popularPosts}
            />
          </Stack>
          <Stack as="section">
            <PostSection heading="更新記事" headingLevel="h3" headingWeight="normal" posts={updatesPosts} />
          </Stack>
        </Stack>

        <Stack as="section">
          <TagSection heading="タグ" headingLevel="h2" headingWeight="normal" href="/tags" tags={tags} />
        </Stack>
      </Stack>
    </>
  );
}

Index.getLayout = createGetLayout();
