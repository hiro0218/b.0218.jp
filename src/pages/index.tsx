import Head from 'next/head';

import { Hero, PostSection, TitleSection } from '@/client/home';
import { Grid, PageContainer, Stack } from '@/components/UI/Layout';
import { ScreenReaderOnlyText as SrOnly } from '@/components/UI/ScreenReaderOnlyText';
import PostTag from '@/components/UI/Tag';
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
          <TitleSection href="/archive" text="記事" />
          <PostSection posts={recentPosts} title="最新記事" titleTagName="h3" />
          <PostSection posts={updatesPosts} title="更新記事" titleTagName="h3" />
        </Stack>

        <Stack as="section">
          <TitleSection href="/tags" text="タグ" />
          <Grid>
            <PostTag tags={tags} />
          </Grid>
        </Stack>
      </PageContainer>
    </>
  );
}
