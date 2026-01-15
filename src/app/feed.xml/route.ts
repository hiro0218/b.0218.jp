import { Feed } from 'feed';
import { AUTHOR_NAME, SCREEN_IMAGE, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/constants';
import { getPostsJson } from '@/lib/data/posts';
import { getDescriptionText } from '@/lib/domain/json-ld';
import { getOgpImage, getPermalink } from '@/lib/utils/url';

export const dynamic = 'force-static';

export function GET() {
  const feed = new Feed({
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    id: SITE_URL,
    link: SITE_URL,
    language: 'ja',
    image: SCREEN_IMAGE,
    copyright: `© ${AUTHOR_NAME}`,
    updated: new Date(),
    feedLinks: {
      rss2: `${SITE_URL}/feed.xml`,
    },
    author: {
      name: AUTHOR_NAME,
      link: SITE_URL,
    },
  });

  const posts = getPostsJson();

  posts
    .filter((post) => post.noindex !== true)
    .slice(0, 30)
    .forEach((post) => {
      const ogpImage = `${getOgpImage(post.slug)}`;
      const permalink = getPermalink(post.slug);

      feed.addItem({
        title: post.title,
        description: getDescriptionText(post.content),
        id: post.slug,
        link: permalink,
        guid: permalink,
        date: new Date(post.date),
        image: ogpImage,
      });
    });

  return new Response(feed.rss2(), {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
