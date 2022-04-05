import { Feed } from 'feed';
import fs from 'fs-extra';

import { AUTHOR, SITE } from '../constant';
import { getPostsJson } from '../lib/posts';

function generatedRssFeed(): void {
  const feed = new Feed({
    title: `${SITE.NAME}`,
    description: `${SITE.DESCRIPTION}`,
    id: SITE.URL,
    link: SITE.URL,
    language: 'ja',
    image: `${SITE.URL}hiro0218.png`,
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

  posts.forEach((post, index) => {
    if (index < 30) {
      feed.addItem({
        title: post.title,
        description: post.excerpt,
        id: post.slug,
        link: `${SITE.URL}${post.slug}.html`,
        date: new Date(post.date),
      });
    }
  });

  fs.writeFileSync('./public/feed.xml', feed.rss2());
  fs.writeFileSync('./public/atom.xml', feed.atom1());
  fs.writeFileSync('./public/feed.json', feed.json1());
}

generatedRssFeed();

export default generatedRssFeed;
