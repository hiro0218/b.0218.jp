import { AUTHOR, SITE } from '../constant';
import { Post } from '../types/source';

const getOgImagePath = (slug: string): string => {
  return `https://hiro0218.github.io/blog/images/ogp/${slug}.png`;
};

const getDescriptionText = (postContent: string): string => {
  let content = postContent;

  // strip line break
  content = content.replace(/(?:\r\n|\r|\n)/g, '');

  // strip tag
  content = content.replace(/<\/?[^>]+(>|$)/g, ' ');

  // character extraction
  content = content.substring(0, 140);

  return content;
};

export const getBlogPostingStructured = (post: Post) => {
  return {
    '@context': 'http://schema.org',
    '@type': 'BlogPosting',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE.URL}${post.slug}.html`,
    },
    headline: post.title,
    datePublished: post.date,
    dateModified: post.updated,
    author: { '@type': 'Person', name: AUTHOR.NAME },
    description: getDescriptionText(post.content),
    image: [getOgImagePath(post.slug)],
    publisher: {
      '@type': 'Organization',
      name: SITE.NAME,
      logo: {
        '@type': 'ImageObject',
        url: 'https://b.0218.jp/hiro0218.png',
        width: '400px',
        height: '400px',
      },
    },
  };
};

export const getBreadcrumbStructured = (post: Post) => {
  let itemCount = 1;
  const itemListElement = [
    {
      '@type': 'ListItem',
      position: itemCount,
      item: { '@id': SITE.URL, name: SITE.NAME },
    },
  ];

  if (post.categories) {
    for (let i = 0; i < post.categories.length; i++) {
      const category = post.categories[i];
      itemListElement.push({
        '@type': 'ListItem',
        position: ++itemCount,
        item: {
          '@id': `${SITE.URL}/categories/${category}`,
          name: category,
        },
      });
    }
  }

  itemListElement.push({
    '@type': 'ListItem',
    position: ++itemCount,
    item: { '@id': `${SITE.URL}${post.slug}.html`, name: post.title },
  });

  const structure = Object.assign(
    {
      '@context': 'http://schema.org',
      '@type': 'BreadcrumbList',
      name: 'パンくずリスト',
    },
    { itemListElement: itemListElement },
  );

  return structure;
};
