import type { Metadata } from 'next/types';
import { getMetadata } from '@/app/_metadata';
import { getData } from '@/app/(ArchivePage)/popular/_lib/getData';
import { PostTimeline } from '@/components/Page/_shared/PostTimeline';
import { Sidebar } from '@/components/UI/Layout/Sidebar';
import { Title } from '@/components/UI/Title';
import { SITE_URL } from '@/constants';

const { popularPosts } = getData();
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
