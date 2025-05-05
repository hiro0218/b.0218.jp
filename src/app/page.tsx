import type { Metadata } from 'next';
import { Container } from '@/components/Functional/Container';
import { Hero } from '@/components/Page/Home';
import { PostSection } from '@/components/Page/Share/PostSection';
import { TagSection } from '@/components/Page/Share/TagSection';
import Heading from '@/components/UI/Heading';
import { Box, Sidebar, Stack } from '@/components/UI/Layout';
import { SITE_URL } from '@/constant';
import { getData } from './libs';

const data = getData();
const { recentPosts, updatesPosts, popularPosts, tags } = data;

export const metadata: Metadata = {
  alternates: {
    canonical: SITE_URL,
  },
};

export default async function Page() {
  return (
    <>
      <h1 className="sr-only">トップページ</h1>

      <Container size="default">
        <Stack space={5}>
          <section>
            <Hero />
          </section>
          <Sidebar>
            <Sidebar.Main>
              <Heading as="h2">記事</Heading>
              <Box mt={2}>
                <Stack space={4}>
                  <PostSection
                    heading="最新記事"
                    headingLevel="h3"
                    headingWeight="normal"
                    href="/archive"
                    posts={recentPosts}
                    prefetch={true}
                  />
                  <PostSection
                    heading="注目記事"
                    headingLevel="h3"
                    headingWeight="normal"
                    href="/popular"
                    posts={popularPosts}
                    prefetch={true}
                  />
                  <PostSection heading="更新記事" headingLevel="h3" headingWeight="normal" posts={updatesPosts} />
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
      </Container>
    </>
  );
}
