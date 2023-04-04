import { Feed } from 'feed';
import { writeFile } from 'fs-extra';

import { AUTHOR, SITE } from '@/constant';
import { getPostsJson } from '@/lib/posts';
import { getPermalink } from '@/lib/url';

function generatedRssFeed(): void {
  const feed = new Feed({
    title: SITE.NAME,
    description: SITE.DESCRIPTION,
    id: SITE.URL,
    link: SITE.URL,
    language: 'ja',
    image: AUTHOR.ICON,
    copyright: `© ${AUTHOR.NAME}`,
    updated: new Date(),
    feedLinks: {
      rss2: `${SITE.URL}rss/feed.xml`,
      json: `${SITE.URL}rss/feed.json`,
      atom: `${SITE.URL}rss/atom.xml`,
    },
    author: {
      name: AUTHOR.NAME,
      link: SITE.URL,
    },
  });

  const posts = getPostsJson();
  let loopCount = 0;

  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];

    if (post.noindex == true || post.tags.includes('名探偵コナン')) {
      continue;
    }

    if (loopCount < 30) {
      const permalink = getPermalink(post.slug);

      feed.addItem({
        title: post.title,
        description: post.excerpt.replace(/<[^>]*>/g, ''),
        id: post.slug,
        link: permalink,
        guid: permalink,
        date: new Date(post.date),
      });

      loopCount++;
    }
  }

  writeFile('./public/feed.xml', feed.rss2());
  writeFile('./public/atom.xml', feed.atom1());
  writeFile('./public/feed.json', feed.json1());
}

generatedRssFeed();

export default generatedRssFeed;
