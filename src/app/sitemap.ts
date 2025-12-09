import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/constant';
import { getPostsListJson, getTagsWithCount } from '@/lib/data/posts';
import { getOgpImage, getPermalink } from '@/lib/utils/url';

const posts = getPostsListJson();
const tags = getTagsWithCount();

export const dynamic = 'force-static';

const pages = [
  { path: '', priority: 1.0 },
  { path: 'popular', priority: 0.8 },
  { path: 'archive', priority: 0.8 },
  { path: 'tags', priority: 0.5 },
  // @todo generate from pages.json
  { path: 'about', priority: 0.5 },
  { path: 'privacy', priority: 0.5 },
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const pageList: MetadataRoute.Sitemap = pages.map(({ path, priority }) => {
    return {
      url: `${SITE_URL}/${path}`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly',
      priority,
    };
  });

  const postList: MetadataRoute.Sitemap = posts.map((post) => {
    const ogpImage = `${getOgpImage(post.slug)}`;
    const permalink = getPermalink(post.slug);

    return {
      url: permalink,
      lastModified: post.date,
      changeFrequency: 'weekly',
      priority: 0.7,
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
