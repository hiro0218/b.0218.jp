import { SITE_URL } from '@/constant';

export const getPermalink = (slug: string) => {
  return `${SITE_URL}/${slug}.html`;
};

export const getOgpImage = (slug: string) => {
  return `${SITE_URL}/images/ogp/${slug}.png`;
};
