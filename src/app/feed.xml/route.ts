import { Feed } from 'feed';
import { AUTHOR_NAME, SCREEN_IMAGE, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/constants';
import { getPostsJson } from '@/lib/data/posts';
import { getDescriptionText } from '@/lib/domain/json-ld';
import { getOgpImage, getPermalink } from '@/lib/utils/url';

export const dynamic = 'force-static';

export async function GET() {
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
  let loopCount = 0;

  posts.forEach((post) => {
    if (post.noindex == true) {
      return;
    }

    if (loopCount < 30) {
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

      loopCount++;
    }
  });

  return new Response(feed.rss2(), {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
