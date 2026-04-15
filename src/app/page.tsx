import type { Metadata } from 'next';
import { StructuredData } from '@/components/Functional/StructuredData';
import { PostSection } from '@/components/Page/_shared/PostSection';
import { TagSection } from '@/components/Page/_shared/TagSection';
import { Hero } from '@/components/Page/Home';
import Heading from '@/components/UI/Heading';
import { Stack } from '@/components/UI/Layout';
import { Container } from '@/components/UI/Layout/Container';
import { SITE_URL } from '@/constants';
import { getOrganizationStructured, getWebSiteStructured } from '@/lib/domain/json-ld';
import { getData } from './_lib';

const data = getData();
const { recentPosts, popularPosts, tags } = data;

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
          <Stack gap={2}>
            <Heading as="h2">記事</Heading>
            <Stack gap={4}>
              <PostSection
                heading="最新記事"
                headingLevel="h3"
                headingWeight="normal"
                href="/archive"
                posts={recentPosts}
                prefetch
              />
              <TagSection heading="タグ" headingLevel="h3" headingWeight="normal" href="/tags" tags={tags} />
              <PostSection
                heading="定番記事"
                headingLevel="h3"
                headingWeight="normal"
                href="/popular"
                posts={popularPosts}
                prefetch
              />
            </Stack>
          </Stack>
        </Stack>
      </Container>
    </>
  );
}
