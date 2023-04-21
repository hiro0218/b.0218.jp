import { SITE } from '@/constant';

export const getPermalink = (slug: string) => {
  return `${SITE.URL}/${slug}.html`;
};

export const getOgpImage = (slug: string) => {
  return `${SITE.URL}/images/ogp/${slug}.webp`;
};
