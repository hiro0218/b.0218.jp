import { SITE_URL } from '@/constants';
import { createPostsRssFeed, createRssResponse } from '@/lib/feed/rss';
import { getPostsListJson } from '@/lib/source/post';

export const dynamic = 'force-static';

export function GET() {
  const feed = createPostsRssFeed({
    feedUrl: `${SITE_URL}/feed.xml`,
    posts: getPostsListJson(),
  });

  return createRssResponse(feed);
}
