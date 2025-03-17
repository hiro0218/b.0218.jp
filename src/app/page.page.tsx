import { Container } from '@/components/Functional/Container';
import Heading from '@/components/UI/Heading';
import { Box, Sidebar, Stack } from '@/components/UI/Layout';
import { SITE_URL } from '@/constant';
import { PostSection } from '@/pages/_components/PostSection';
import { TagSection } from '@/pages/_components/TagSection';
import { Hero } from '@/pages/_components/home';
import { getData } from '@/pages/_libs';
import type { Metadata } from 'next';

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
      </Container>
    </>
  );
}
