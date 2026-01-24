import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/constants';
import { getPostsListJson, getTagsWithCount } from '@/lib/data/posts';
import { getOgpImage, getPermalink } from '@/lib/utils/url';

const posts = getPostsListJson();
const tags = getTagsWithCount();

export const dynamic = 'force-static';

const pages = [
  { path: '', priority: 1.0, usesLatestPostDate: true, changeFrequency: 'daily' as const },
  { path: 'popular', priority: 0.8, usesLatestPostDate: true, changeFrequency: 'daily' as const },
  { path: 'archive', priority: 0.8, usesLatestPostDate: true, changeFrequency: 'daily' as const },
  { path: 'tags', priority: 0.5, usesLatestPostDate: true, changeFrequency: 'weekly' as const },
  // @todo generate from pages.json
  { path: 'about', priority: 0.5, usesLatestPostDate: false, changeFrequency: 'yearly' as const },
  { path: 'privacy', priority: 0.5, usesLatestPostDate: false, changeFrequency: 'yearly' as const },
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  // 最新記事の日付を取得
  const latestPostDate = posts.length > 0 ? posts[0].date : undefined;

  const pageList: MetadataRoute.Sitemap = pages.map(({ path, priority, usesLatestPostDate, changeFrequency }) => {
    return {
      url: `${SITE_URL}/${path}`,
      lastModified: usesLatestPostDate ? latestPostDate : undefined,
      changeFrequency,
      priority,
    };
  });

  const postList: MetadataRoute.Sitemap = posts.map((post) => {
    const ogpImage = `${getOgpImage(post.slug)}`;
    const permalink = getPermalink(post.slug);

    return {
      url: permalink,
      lastModified: post.date,
      changeFrequency: 'monthly',
      priority: 0.7,
      images: [ogpImage],
    };
  });

  const tagList: MetadataRoute.Sitemap = tags.map(({ slug }) => {
    const permalink = `${SITE_URL}/tags/${slug}`;
    // このタグを持つ記事の最新日付を取得
    const tagPosts = posts.filter((post) => post.tags.includes(slug));
    const latestTagPostDate = tagPosts.length > 0 ? tagPosts[0].date : undefined;

    return {
      url: permalink,
      lastModified: latestTagPostDate,
      changeFrequency: 'weekly',
      priority: 0.5,
    };
  });

  return [...pageList, ...postList, ...tagList];
}
