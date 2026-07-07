import type { Metadata } from 'next/types';
import { getMetadata } from '@/app/_metadata';
import { PostTimeline } from '@/components/Page/_shared/PostTimeline';
import { Sidebar } from '@/components/UI/Layout/Sidebar';
import { Title } from '@/components/UI/Title';
import { SITE_URL } from '@/constants';
import { getPopularPost } from '@/lib/post/list';
import { getPostsListJson } from '@/lib/source/post';

const POST_DISPLAY_LIMIT = 20;

const popularPosts = getPopularPost(getPostsListJson(), POST_DISPLAY_LIMIT);
const slug = 'popular';
const title = 'Popular';
const pageTitle = '定番記事';
const description = `${popularPosts.length}件の記事`;

export const metadata: Metadata = getMetadata({
  title,
  description: `${pageTitle} - ${description}`,
  url: `${SITE_URL}/${slug}`,
});

export default function Page() {
  return (
    <>
      <Title paragraph={description}>{title}</Title>
      <Sidebar>
        <Sidebar.Side>
          <Sidebar.Title>{pageTitle}</Sidebar.Title>
        </Sidebar.Side>
        <Sidebar.Main>
          <PostTimeline posts={popularPosts} />
        </Sidebar.Main>
      </Sidebar>
    </>
  );
}
