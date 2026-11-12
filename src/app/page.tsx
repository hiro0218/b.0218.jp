import type { Metadata } from 'next';
import { StructuredData } from '@/components/Functional/StructuredData';
import { PostSection } from '@/components/Page/_shared/PostSection';
import { pageSections } from '@/components/Page/_shared/pageSections';
import { TagSection } from '@/components/Page/_shared/TagSection';
import { Hero } from '@/components/Page/Home/Hero';
import { Container } from '@/components/UI/Layout/Container';
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL, TAG_VIEW_LIMIT } from '@/constants';
import { getOrganizationStructured, getWebSiteStructured } from '@/lib/domain/json-ld';
import { getFilteredPosts, getPopularPost, getRecentPosts, isIgnoredPostTag } from '@/lib/post/list';
import { getTagsWithCount } from '@/lib/source/tag';

const POPULAR_POST_DISPLAY_LIMIT = 6;

const tagsWithCount = getTagsWithCount();
const recentPosts = getRecentPosts();
const filteredPosts = getFilteredPosts();
const popularPosts = getPopularPost(filteredPosts, POPULAR_POST_DISPLAY_LIMIT);
const tags = tagsWithCount
  .filter(({ slug, count }) => !isIgnoredPostTag(slug) && count >= 10)
  .slice(0, 25)
  .map((tag) => ({ ...tag, isNavigable: tag.count >= TAG_VIEW_LIMIT }));

export const metadata: Metadata = {
  title: {
    absolute: `${SITE_NAME} - ${SITE_DESCRIPTION}`,
  },
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

      <h1 className="sr-only">{`${SITE_NAME} - ${SITE_DESCRIPTION}`}</h1>

      <Container size="default">
        <div className={pageSections}>
          <section>
            <Hero />
          </section>
          {/* 「記事」でまとめる見出しは置かない。最新記事と定番記事の間にある「タグ」は記事でなく、名前が合わないため */}
          <PostSection heading="最新記事" href="/archive" layout="timeline" posts={recentPosts} prefetch />
          <TagSection heading="タグ" href="/tags" isWideCluster={false} tags={tags} />
          <PostSection heading="定番記事" href="/popular" layout="timeline" posts={popularPosts} prefetch />
        </div>
      </Container>
    </>
  );
}
