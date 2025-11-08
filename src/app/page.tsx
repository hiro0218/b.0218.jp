import type { Metadata } from 'next';
import { PostSection } from '@/components/Page/_shared/PostSection';
import { TagSection } from '@/components/Page/_shared/TagSection';
import { Hero } from '@/components/Page/Home';
import Heading from '@/components/UI/Heading';
import { Box, Sidebar, Stack } from '@/components/UI/Layout';
import { Container } from '@/components/UI/Layout/Container';
import { SITE_URL } from '@/constant';
import { getOrganizationStructured, getWebSiteStructured } from '@/lib/domain/json-ld';
import { getData } from './libs';

const data = getData();
const { recentPosts, updatesPosts, popularPosts, tags } = data;

const postSections = [
  { heading: '最新記事', href: '/archive', posts: recentPosts },
  { heading: '注目記事', href: '/popular', posts: popularPosts },
  { heading: '更新記事', posts: updatesPosts },
];

export const metadata: Metadata = {
  alternates: {
    canonical: SITE_URL,
  },
};

export default async function Page() {
  const webSiteStructured = getWebSiteStructured();
  const organizationStructured = getOrganizationStructured();

  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([webSiteStructured, organizationStructured]),
        }}
        type="application/ld+json"
      />

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
                  {postSections.map(({ heading, href, posts }, index) => (
                    <PostSection
                      heading={heading}
                      headingLevel="h3"
                      headingWeight="normal"
                      href={href}
                      key={index}
                      posts={posts}
                      prefetch={!!href}
                    />
                  ))}
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
