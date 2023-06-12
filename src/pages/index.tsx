import Head from 'next/head';

import { Hero, LinkMore, PostSection } from '@/client/home';
import Heading from '@/components/UI/Heading';
import { PageContainer, Stack } from '@/components/UI/Layout';
import { ScreenReaderOnlyText as SrOnly } from '@/components/UI/ScreenReaderOnlyText';
import PostTag, { PostTagGridContainer } from '@/components/UI/Tag';
import { AUTHOR_ICON, SITE_URL } from '@/constant';
import { getOrganizationStructured } from '@/lib/json-ld';
import { getData } from '@/server/home';

const data = getData();

export default function Index() {
  const { recentPosts, updatesPosts, tags } = data;

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

      <PageContainer>
        <SrOnly as="h1" text="トップページ" />

        <Stack as="section">
          <Hero />
        </Stack>

        <Stack as="section">
          <Heading as="h2" text="記事" textSide={<LinkMore href="/archive" text="archive" />} />
          <PostSection posts={recentPosts} title="最新記事" titleTagName="h3" />
          <PostSection posts={updatesPosts} title="更新記事" titleTagName="h3" />
        </Stack>

        <Stack as="section">
          <Heading as="h2" text="タグ" textSide={<LinkMore href="/tags" text="tags" />} />
          <PostTagGridContainer>
            <PostTag tags={tags} />
          </PostTagGridContainer>
        </Stack>
      </PageContainer>
    </>
  );
}
