import CONSTANT from '~/constant';

interface Post {
  date: string;
  updated: string;
  slug: string;
  link: string;
  title: string;
  content: string;
  excerpt: string;
  thumbnail: string;
  categories: [];
  tags: [];
  next: {};
  prev: {};
}

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

export const getBlogPostingStructured = (post: Post): string => {
  return JSON.stringify({
    '@context': 'http://schema.org',
    '@type': 'BlogPosting',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${CONSTANT.SITE_URL}${post.slug}`,
    },
    headline: post.title,
    datePublished: post.date,
    dateModified: post.updated,
    author: { '@type': 'Person', name: CONSTANT.AUTHOR },
    description: getDescriptionText(post.content),
    image: {
      '@type': 'ImageObject',
      url: post.thumbnail,
      width: 696,
      height: 696,
    },
    publisher: {
      '@type': 'Organization',
      name: CONSTANT.SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: 'https://b.0218.jp/hiro0218.png',
        width: '400px',
        height: '400px',
      },
    },
  });
};

export const getBreadcrumbStructured = (post: Post): string => {
  let itemCount = 1;
  const itemListElement = [
    {
      '@type': 'ListItem',
      position: itemCount,
      item: { '@id': CONSTANT.SITE_URL, name: CONSTANT.SITE_NAME },
    },
  ];

  if (post.categories) {
    for (let i = 0; i < post.categories.length; i++) {
      const category: { [key: string]: string } = post.categories[i];
      itemListElement.push({
        '@type': 'ListItem',
        position: ++itemCount,
        item: {
          '@id': `${CONSTANT.SITE_URL}/${category.path}`,
          name: category.name,
        },
      });
    }
  }

  itemListElement.push({
    '@type': 'ListItem',
    position: ++itemCount,
    item: { '@id': post.link, name: post.title },
  });

  const structure = Object.assign(
    {
      '@context': 'http://schema.org',
      '@type': 'BreadcrumbList',
    },
    { itemListElement: itemListElement },
  );

  return JSON.stringify(structure);
};
