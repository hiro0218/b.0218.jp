import { SITE_NAME } from '@/constants';
import { createPostsRssFeed, createRssResponse } from '@/lib/feed/rss';
import { getPostsListJson } from '@/lib/source/post';
import { tagFeedPermalink, tagPermalink } from '@/lib/tag/navigation';
import { getRoutableTagByRouteSlug, getRoutableTagStaticParams } from '@/lib/tag/routing';

type Params = Promise<{ slug: string }>;

export const dynamic = 'force-static';
export const dynamicParams = false;

export function generateStaticParams() {
  return getRoutableTagStaticParams();
}

export async function GET(_request: Request, { params }: { params: Params }) {
  const { slug } = await params;
  const tag = getRoutableTagByRouteSlug(slug);

  if (!tag) {
    return new Response(null, { status: 404 });
  }

  const posts = getPostsListJson().filter((post) => post.tags.includes(tag.name));
  const tagUrl = tagPermalink(tag.name);
  const feed = createPostsRssFeed({
    title: `${tag.name} | ${SITE_NAME}`,
    description: `${tag.name}の記事一覧 - ${SITE_NAME}`,
    id: tagUrl,
    link: tagUrl,
    feedUrl: tagFeedPermalink(tag.name),
    posts,
  });

  return createRssResponse(feed);
}
