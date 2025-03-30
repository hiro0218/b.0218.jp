import { SITE_URL } from '@/constant';
import { getPostsListJson, getTagsWithCount } from '@/lib/posts';
import { getOgpImage, getPermalink } from '@/lib/url';
import type { MetadataRoute } from 'next';

const posts = getPostsListJson();
const tags = getTagsWithCount();

export const dynamic = 'force-static';

const pages = [
  '',
  'popular',
  'tags',
  'archive',
  // @todo generate from pages.json
  'about',
  'privacy',
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const pageList: MetadataRoute.Sitemap = pages.map((page) => {
    return {
      url: `${SITE_URL}/${page}`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly',
      priority: 0.5,
    };
  }) as MetadataRoute.Sitemap;

  const postList: MetadataRoute.Sitemap = posts.map((post) => {
    const ogpImage = `${getOgpImage(post.slug)}`;
    const permalink = getPermalink(post.slug);

    return {
      url: permalink,
      lastModified: post.date,
      changeFrequency: 'weekly',
      priority: 0.5,
      images: [ogpImage],
    };
  });

  const tagList: MetadataRoute.Sitemap = tags.map(({ slug }) => {
    const permalink = `${SITE_URL}/tags/${slug}`;
    return {
      url: permalink,
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly',
      priority: 0.5,
    };
  });

  return [...pageList, ...postList, ...tagList];
}
