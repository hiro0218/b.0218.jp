import Head from 'next/head';

import Heading from '@/components/UI/Heading';
import { Box, Sidebar, Stack } from '@/components/UI/Layout';
import { AUTHOR_ICON, SITE_URL } from '@/constant';
import { getOrganizationStructured } from '@/lib/json-ld';
import { PostSection } from '@/pages/_components/PostSection';
import { TagSection } from '@/pages/_components/TagSection';
import { Hero } from '@/pages/_components/home';
import { createGetLayout } from '@/pages/_layouts/TopPageLayout';

import { getData } from './_libs';

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

      <h1 className="sr-only">トップページ</h1>

      <Stack space={5}>
        <section>
          <Hero />
        </section>
        <Sidebar>
          <Sidebar.Main>
            <Heading as="h2" text="記事" />
            <Box mt={2}>
              <Stack space={4}>
                <PostSection
                  heading="最新記事"
                  headingLevel="h3"
                  headingWeight="normal"
                  href="/archive"
                  posts={recentPosts}
                  updateTarget="date"
                />
                <PostSection
                  heading="注目記事"
                  headingLevel="h3"
                  headingWeight="normal"
                  href="/popular"
                  posts={popularPosts}
                />
                <PostSection
                  heading="更新記事"
                  headingLevel="h3"
                  headingWeight="normal"
                  posts={updatesPosts}
                  updateTarget="updated"
                />
              </Stack>
            </Box>
          </Sidebar.Main>
          <Sidebar.Side>
            <Stack space={4}>
              <TagSection heading="タグ" headingLevel="h2" headingWeight="normal" href="/tags" tags={tags} />
            </Stack>
          </Sidebar.Side>
        </Sidebar>
      </Stack>
    </>
  );
}

Index.getLayout = createGetLayout();
