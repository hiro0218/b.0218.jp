import { SITE_URL } from '@/constants';

export const convertPostSlugToPath = (slug: string) => {
  return `/${slug}.html` as const;
};

export const getPermalink = (slug: string) => {
  return `${SITE_URL}/${slug}.html` as const;
};

export const getOgpImage = (slug: string) => {
  return `${SITE_URL}/images/ogp/${slug}.jpg` as const;
};
