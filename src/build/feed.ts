import { Feed } from 'feed';

import { AUTHOR_NAME, SCREEN_IMAGE, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/constant';
import { getDescriptionText } from '@/lib/json-ld';
import { getPostsJson } from '@/lib/posts';
import { getPermalink } from '@/lib/url';
import { writeFile } from '@/shared/fs';

function generatedRssFeed() {
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
      rss2: `${SITE_URL}/rss/feed.xml`,
      json: `${SITE_URL}/rss/feed.json`,
      atom: `${SITE_URL}/rss/atom.xml`,
    },
    author: {
      name: AUTHOR_NAME,
      link: SITE_URL,
    },
  });

  const posts = getPostsJson();
  let loopCount = 0;

  posts.forEach((post) => {
    if (post.noindex == true || post.tags.includes('名探偵コナン')) {
      return;
    }

    if (loopCount < 30) {
      const permalink = getPermalink(post.slug);

      feed.addItem({
        title: post.title,
        description: getDescriptionText(post.content),
        id: post.slug,
        link: permalink,
        guid: permalink,
        date: new Date(post.date),
      });

      loopCount++;
    }
  });

  writeFile('./public/feed.xml', feed.rss2());
  writeFile('./public/atom.xml', feed.atom1());
  writeFile('./public/feed.json', feed.json1());
}

generatedRssFeed();
