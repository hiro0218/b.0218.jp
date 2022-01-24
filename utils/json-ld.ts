import { BlogPosting, BreadcrumbList, ListItem, WithContext } from 'schema-dts';

import { AUTHOR, SITE } from '../constant';
import { Post } from '../types/source';

export const getDescriptionText = (postContent: string): string => {
  let content = postContent;

  // strip line break
  content = content.replace(/(?:\r\n|\r|\n)/g, '');

  // strip tag
  content = content.replace(/<\/?[^>]+(>|$)/g, ' ');

  // character extraction
  content = content.substring(0, 140);

  return content;
};

export const getBlogPostingStructured = (post: Post): WithContext<BlogPosting> => {
  return {
    '@context': 'https://schema.org',
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
    image: [`${SITE.URL}images/ogp/${post.slug}.png`],
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
  const itemListElement: ListItem[] = [
    {
      '@type': 'ListItem',
      position: 1,
      name: SITE.NAME,
      item: SITE.URL,
    },
  ];

  if (post.categories) {
    for (let i = 0; i < post.categories.length; i++) {
      const category = post.categories[i];
      itemListElement.push({
        '@type': 'ListItem',
        position: i + 2,
        name: category,
        item: `${SITE.URL}categories/${category}`,
      });
    }
  }

  itemListElement.push({
    '@type': 'ListItem',
    position: post.categories.length + 2,
    name: post.title,
    item: `${SITE.URL}${post.slug}.html`,
  });

  const structure: WithContext<BreadcrumbList> = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    name: 'パンくずリスト',
    itemListElement: itemListElement,
  };

  return structure;
};
