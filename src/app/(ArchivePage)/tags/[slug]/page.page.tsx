import { getMetadata } from '@/app/(ArchivePage)/metadata';
import { SITE_NAME, SITE_URL } from '@/constant';
import { getTagPosts } from '@/pages/_libs/getTagPosts';
import type { Metadata } from 'next';
import TagPage from './components/TagPage';
import { getStaticPathsTagDetail } from './libs';

export const generateStaticParams = async () => getStaticPathsTagDetail();

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { slug } = await params;

  return getMetadata({
    title: `Tag: ${slug}`,
    description: `Tag: ${slug} - ${SITE_NAME}`,
    url: `${SITE_URL}/tag/${slug}`,
  });
}

export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  const posts = getTagPosts(slug);
  const totalItems = posts.length;

  return <TagPage slug={slug} posts={posts} totalItems={totalItems} />;
}
