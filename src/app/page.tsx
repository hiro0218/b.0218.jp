import type { Metadata } from 'next';
import { StructuredData } from '@/components/Functional/StructuredData';
import { PostSection } from '@/components/Page/_shared/PostSection';
import { TagSection } from '@/components/Page/_shared/TagSection';
import { Hero } from '@/components/Page/Home';
import Heading from '@/components/UI/Heading';
import { Sidebar, Stack } from '@/components/UI/Layout';
import { Container } from '@/components/UI/Layout/Container';
import { SITE_URL } from '@/constants';
import { getOrganizationStructured, getWebSiteStructured } from '@/lib/domain/json-ld';
import { getData } from './_lib';

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

export default function Page() {
  const webSiteStructured = getWebSiteStructured();
  const organizationStructured = getOrganizationStructured();

  return (
    <>
      <StructuredData data={[webSiteStructured, organizationStructured]} />

      <h1 className="sr-only">トップページ</h1>

      <Container size="default">
        <Stack gap={5}>
          <section>
            <Hero />
          </section>
          <Sidebar>
            <Sidebar.Main>
              <Stack gap={2}>
                <Heading as="h2">記事</Heading>
                <Stack gap={4}>
                  {postSections.map(({ heading, href, posts }) => (
                    <PostSection
                      heading={heading}
                      headingLevel="h3"
                      headingWeight="normal"
                      href={href}
                      key={`${href ?? 'section'}:${heading}`}
                      posts={posts}
                      prefetch={!!href}
                    />
                  ))}
                </Stack>
              </Stack>
            </Sidebar.Main>
            <Sidebar.Side>
              <Stack gap={4}>
                <TagSection heading="タグ" headingLevel="h2" headingWeight="normal" href="/tags" tags={tags} />
              </Stack>
            </Sidebar.Side>
          </Sidebar>
        </Stack>
      </Container>
    </>
  );
}
