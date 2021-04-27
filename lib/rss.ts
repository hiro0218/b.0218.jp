import RSS from 'rss';

import posts from '@/_source/posts.json';
import { SITE } from '@/constant';

export async function generateFeedXml() {
  const feed = new RSS({
    title: `${SITE.NAME}`,
    description: `${SITE.DESCRIPTION}`,
    site_url: `${SITE.URL}`,
    feed_url: `${SITE.URL}feed`,
    language: 'ja',
  });

  posts?.forEach((post, i) => {
    if (i < 30) {
      feed.item({
        title: post.title,
        description: post.excerpt,
        date: new Date(post.date),
        url: `${SITE.URL}${post.path}`,
      });
    }
  });

  return feed.xml();
}
